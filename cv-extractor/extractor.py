import re
import fitz
from datetime import datetime
from pathlib import Path


def pdf_to_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    return "\n".join(p.get_text("text") for p in doc)


def basic_clean(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.replace("\xa0", " ").replace("\u2013", "-").replace("\u2014", "-")
    text = text.replace("\ufeff", "").replace("－", " ")
    text = re.sub(r"\bcompany\s+name\b", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\bcity\s*,?\s*state\b", "", text, flags=re.IGNORECASE)
    text = text.replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def clean_section_text(text: str) -> str:
    text = basic_clean(text)
    text = text.lower()
    text = re.sub(r"[\u2022\u25cf\u25cb\u25aa\uf0b7\xb7\*\•·]", ",", text)
    text = re.sub(r"[,\s]{2,}", " ", text)
    return text.strip().strip(",").strip()


SECTION_PATTERNS = {
    "summary": (
        r"(?:summary|professional\s+summary|career\s+summary"
        r"|profile|professional\s+profile|career\s+profile"
        r"|executive\s+profile|objective|career\s+objective|professional\s+objective"
        r"|about\s+me|introduction"
        r"|ringkasan|profil|tentang\s+saya|objektif)"
    ),
    "highlights": (
        r"(?:highlights?|skill\s+highlights?|core\s+competencies"
        r"|accomplishments?|qualifications?|core\s+qualifications?"
        r"|pencapaian|prestasi)"
    ),
    "experience": (
        r"(?:experience|work\s+experience|professional\s+experience"
        r"|work\s+history|employment|employment\s+history"
        r"|internship|internships?|projects?|project\s+experience"
        r"|pengalaman|pengalaman\s+kerja|riwayat\s+pekerjaan)"
    ),
    "education": (
        r"(?:education|educational\s+background|academic\s+background"
        r"|academic\s+qualifications?|qualifications?|academic|degree"
        r"|university|college|training"
        r"|pendidikan|riwayat\s+pendidikan|latar\s+belakang\s+pendidikan)"
    ),
    "certifications": (
        r"(?:certifications?|licenses?\s+and\s+certifications?|certifications?\s+and\s+licenses?"
        r"|professional\s+certifications?|credentials?|certificates?"
        r"|professional\s+development|courses?|training"
        r"|sertifikasi|sertifikat|lisensi|pelatihan)"
    ),
    "skills": (
        r"(?:skills?|technical\s+skills?|core\s+skills?|competencies"
        r"|expertise|proficiencies|technologies|tools?"
        r"|areas\s+of\s+expertise"
        r"|keahlian|keterampilan|kompetensi|kemampuan)"
    ),
}

SECTION_REGEX = re.compile(
    r"(?:^|(?:\n\s*)|\s{3,})"
    r"("
    + "|".join(v for v in SECTION_PATTERNS.values() if v)
    + r")"
    r"(?:\s{2,}|\s*[\n\t:])",
    re.IGNORECASE | re.MULTILINE
)


def _map_to_section(matched_text: str) -> str:
    for key, pattern in SECTION_PATTERNS.items():
        if pattern and re.fullmatch(pattern, matched_text, re.IGNORECASE):
            return key
    return None


def extract_sections(text: str) -> dict:
    result = {k: "" for k in SECTION_PATTERNS}
    result["other"] = ""

    splits = []
    for m in SECTION_REGEX.finditer(text):
        matched = m.group(1).lower().strip()
        section_key = _map_to_section(matched)
        splits.append((m.start(), m.end(), section_key))

    if not splits:
        result["summary"] = clean_section_text(text)
        return result

    for i, (start, end, key) in enumerate(splits):
        next_start = splits[i + 1][0] if i + 1 < len(splits) else len(text)
        section_text = text[end:next_start].strip()

        if key == "skills":
            cleaned = basic_clean(section_text).lower()
        elif key == "certifications":
            cleaned = section_text
        else:
            cleaned = clean_section_text(section_text)

        if key:
            result[key] = (result[key] + " " + cleaned).strip() if result[key] else cleaned
        else:
            result["other"] = (result["other"] + " " + cleaned).strip()

    return result


def parse_skills_list(skills_text: str) -> list:
    if not skills_text:
        return []
    items = re.split(r"[,;]", skills_text)
    return [s.strip().lower() for s in items if s.strip() and len(s.strip()) > 1]


MONTHS_PATTERN = r"(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)"

DATE_RANGE_REGEX = re.compile(
    rf"({MONTHS_PATTERN}\s+\d{{4}}|\d{{1,2}}/\d{{2,4}}|\b(?:19[5-9]\d|20[0-2]\d)\b)"
    rf"\s*(?:to|until|-|–)\s*"
    rf"({MONTHS_PATTERN}\s+\d{{4}}|\d{{1,2}}/\d{{2,4}}|\b(?:19[5-9]\d|20[0-2]\d)\b|current|present|now)",
    re.IGNORECASE,
)


def parse_date(s: str):
    s = s.lower().strip()
    if any(x in s for x in ["current", "present", "now"]):
        now = datetime.now()
        return now.year + now.month / 12
    if "/" in s:
        parts = s.split("/")
        m, y = parts[0], parts[1]
        return int(y) + (int(m) / 12 if m.isdigit() else 0)
    m_y = re.search(rf"({MONTHS_PATTERN})\s+(\d{{4}})", s)
    if m_y:
        m_map = {m: i+1 for i, m in enumerate(
            ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"])}
        return int(m_y.group(2)) + m_map[m_y.group(1)[:3]] / 12
    if re.fullmatch(r"(?:19[5-9]\d|20[0-2]\d)", s):
        return float(s)
    return None


def calculate_total_experience(experience_text: str) -> float:
    if not isinstance(experience_text, str) or not experience_text.strip():
        return 0.0

    seen = set()
    total = 0.0

    for m in DATE_RANGE_REGEX.finditer(experience_text):
        key = (m.group(1).lower().strip(), m.group(2).lower().strip())
        if key in seen:
            continue
        seen.add(key)
        start = parse_date(m.group(1))
        end = parse_date(m.group(2))
        if start and end:
            diff = abs(end - start)
            if diff <= 50:
                total += diff

    return round(total, 1) if total else 0.0


CERT_REGEX = re.compile(
    r"(?:"
    r"(?:certified\s+[\w\s]{2,40}(?:professional|specialist|analyst|manager|associate|consultant|practitioner|engineer|developer|administrator))"
    r"|(?:[\w\s]{1,30}certification)"
    r"|(?:certificate\s+(?:in\s+)?[\w\s]{2,40})"
    r"|(?:license[d]?\s+(?:in\s+)?[\w\s]{2,30})"
    r"|\b(?:cpa|cfa|cma|acca|phr|sphr|shrm-cp|shrm-scp|pmp|cissp|cisa|cism|aws|gcp|azure|six\s+sigma|lean\s+six\s+sigma)\b"
    r")",
    re.IGNORECASE
)


def extract_certifications(full_text: str, cert_section: str = "") -> list:
    found = []
    seen = set()

    if cert_section:
        raw_items = re.split(r"[\n\r]|(?:·|\u2022|\u25cf|\u25aa|\uf0b7|\*)", cert_section)
        if len(raw_items) == 1:
            raw_items = re.split(
                r"(?<=[.)])\s{2,}(?=[A-Z])"
                r"|(?<=\))\s+(?=[A-Z][a-z]+\s+[A-Z])",
                cert_section
            )
        for item in raw_items:
            item = basic_clean(item).lower().strip().strip(",").strip()
            item = re.sub(r"\s+", " ", item)
            if len(item) > 3 and item not in seen:
                seen.add(item)
                found.append(item)
        return found

    for m in CERT_REGEX.finditer(full_text):
        cert = re.sub(r"\s+", " ", m.group()).strip().lower()
        if len(cert) < 3 or cert in seen:
            continue
        seen.add(cert)
        found.append(cert)

    return found


def extract_cv(pdf_path: str) -> dict:
    raw_text = pdf_to_text(pdf_path)
    sections = extract_sections(raw_text)

    skills_raw = sections.get("skills", "")
    skills_list = parse_skills_list(skills_raw)
    experience_years = calculate_total_experience(sections.get("experience", ""))
    certifications = extract_certifications(raw_text, sections.get("certifications", ""))

    return {
        "summary": sections.get("summary", "") or None,
        "highlights": sections.get("highlights", "") or None,
        "experience": sections.get("experience", "") or None,
        "experience_years": experience_years,
        "education": sections.get("education", "") or None,
        "certification": certifications or None,
        "skills": skills_raw or None,
        "skills_list": skills_list,
        "skills_count": len(skills_list),
    }