import re
import fitz
from pathlib import Path


def pdf_to_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    return "\n".join(p.get_text("text") for p in doc)


def basic_clean(text: str) -> str:
    if not isinstance(text, str):
        return ""
    text = text.replace("\xa0", " ").replace("\u2013", "-").replace("\u2014", "-")
    text = re.sub(r"[^\x20-\x7E\n]", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


SECTION_PATTERNS = {
    "summary": (
<<<<<<< Updated upstream
        r"(?:summary|professional\s+summary|career\s+summary"
        r"|profile|professional\s+profile|career\s+profile"
        r"|executive\s+profile|objective|career\s+objective"
        r"|professional\s+objective|about\s+me)"
    ),
    "highlights": r"(?:highlights?|skill\s+highlights?|core\s+competencies|accomplishments?|qualifications?|core\s+qualifications?)",
    "experience": r"(?:experience|work\s+experience|professional\s+experience|work\s+history|employment|employment\s+history)",
    "education": r"(?:education|educational\s+background|academic\s+background|academic\s+qualifications?|qualifications?)",
    "certification": r"(?:certifications?|certificates?|licenses?|credentials?|professional\s+development)",
    "skills": r"(?:skills?|technical\s+skills?|core\s+skills?|competencies|expertise|proficiencies)",
=======
        r"(?:summary|professional\s+summary|profile|about\s+me"
        r"|ringkasan|profil|tentang\s+saya|objektif)"
    ),
    "experience": (
        r"(?:experience|work\s+experience|employment|work\s+history"
        r"|pengalaman|pengalaman\s+kerja|riwayat\s+pekerjaan)"
    ),
    "education": (
        r"(?:education|academic|degree"
        r"|pendidikan|riwayat\s+pendidikan|latar\s+belakang\s+pendidikan)"
    ),
    "certification": (
        r"(?:certifications?|certificates?|licenses?"
        r"|sertifikasi|sertifikat|lisensi|pelatihan)"
    ),
    "skills": (
        r"(?:skills?|technical\s+skills?|competencies|expertise"
        r"|keahlian|keterampilan|kompetensi|kemampuan)"
    ),
    "highlights": (
        r"(?:highlights?|core\s+competencies|accomplishments?"
        r"|pencapaian|prestasi)"
    ),
>>>>>>> Stashed changes
}

SECTION_REGEX = re.compile(
    r"(?im)^\s*(" + "|".join(SECTION_PATTERNS.values()) + r")\s*[:\-]?\s*$"
)


def _map_to_section(matched: str) -> str:
    for key, pattern in SECTION_PATTERNS.items():
        if re.match(pattern, matched, re.IGNORECASE):
            return key
    return "other"


def extract_sections(text: str) -> dict:
    result = {k: "" for k in SECTION_PATTERNS}
    result["other"] = ""

    splits = []
    for m in SECTION_REGEX.finditer(text):
        matched = m.group(1).lower().strip()
        section_key = _map_to_section(matched)
        splits.append((m.start(), m.end(), section_key))

    if not splits:
        result["other"] = basic_clean(text)
        return result

    for i, (start, end, key) in enumerate(splits):
        next_start = splits[i + 1][0] if i + 1 < len(splits) else len(text)
        content = text[end:next_start].strip()
        if result[key]:
            result[key] += "\n" + basic_clean(content)
        else:
            result[key] = basic_clean(content)

    before_first = text[:splits[0][0]].strip()
    if before_first:
        result["other"] = basic_clean(before_first)

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


def calculate_total_experience(experience_text: str) -> float:
    if not isinstance(experience_text, str) or not experience_text.strip():
        return 0.0

    total_months = 0

    for match in DATE_RANGE_REGEX.finditer(experience_text):
        start_str, end_str = match.group(1), match.group(2)

        def parse_date(s):
            s = s.strip().lower()
            if s in ("current", "present", "now"):
                from datetime import datetime
                return datetime.now()
            for fmt in ("%B %Y", "%b %Y", "%m/%Y", "%Y"):
                try:
                    from datetime import datetime
                    return datetime.strptime(s, fmt)
                except ValueError:
                    continue
            return None

        start_date = parse_date(start_str)
        end_date = parse_date(end_str)

        if start_date and end_date and end_date >= start_date:
            months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
            total_months += months

    return round(total_months / 12, 1)


def extract_cv(pdf_path: str) -> dict:
    raw_text = pdf_to_text(pdf_path)
    sections = extract_sections(raw_text)

    skills_raw = sections.get("skills", "")
    skills_list = parse_skills_list(skills_raw)
    experience_years = calculate_total_experience(sections.get("experience", ""))

    return {
        "summary": sections.get("summary", "") or None,
        "highlights": sections.get("highlights", "") or None,
        "experience": sections.get("experience", "") or None,
        "experience_years": experience_years,
        "education": sections.get("education", "") or None,
        "certifications": sections.get("certification", "") or None,
        "skills": skills_raw or None,
        "skills_list": skills_list,
        "skills_count": len(skills_list),
    }