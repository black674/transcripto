# ================= SYSTEM PROMPT ===================
SYSTEM_PROMPT = """
You are an AI that only answers using the given transcript.  
Ignore anything outside it.  
If asked about a time (e.g., "minute 8"), find the closest timestamp and answer from transcript.  
If info not found, reply: "Sorry, I can only answer questions related to the transcript."  
No external knowledge, no greetings, no personal replies.
"""

# =============== BUILD PROMPTS =====================
def build_summary_prompt(transcript: str):
    return f"""
    You are an AI that summarizes transcripts accurately.  
    Read the full transcript, and give a structured summary with key points and facts.  
    Keep all essential details, no assumptions.
    The output should be in the same language as the transcript always.

    Here is the transcript:
    {transcript}
    """

def build_highlights_prompt(transcript: str):
    return f"""
    You are an AI assistant that extracts only the key highlights from transcripts.
    Read the full transcript carefully, and provide a concise list of the **most important points or moments**.
    Do not summarize the whole conversation — just pick out the **noteworthy highlights**, such as important decisions, facts, dates, names, or powerful quotes.

    Your response must:
    - Be in the same language as the transcript.
    - Be written as a **bullet list**.
    - Be clear, direct, and avoid adding assumptions or opinions.

    Here is the transcript:
    {transcript}
    """


def build_study_guide_prompt(transcript: str):
    return f"""
    Act as an AI that turns transcripts into structured study guides.

    Read the transcript and extract:
    - Main topics
    - Key concepts and definitions
    - Important facts (dates, names, examples)
    - Short quiz questions (with no answers)

    Use only the content in the transcript.  
    Output must be in the same language.
    Use clear formatting: headers, bullet points, and numbered lists.

    Transcript:
    {transcript}
    """

def build_qa_prompt(transcript: str):
    return f"""
    Create 10–50 MCQs based on the core ideas in the transcript.  
    Ignore filler examples or random values (like sample names/numbers).  
    Focus on concepts, facts, and opinions stated.  
    Each question has 4 options (A–D).  
    List correct answers at the end. 
    No assumptions, no explanations.
    The reply should be in the same language as the transcript always.

    Here is the transcript:
    {transcript}
    """

def build_custom_prompt(user_prompt: str, transcript: str):
    return f"""
    You answer only using the transcript.  
    If user asks about the speaker’s message, purpose, or identity — infer from the transcript.  
    If the info is missing, reply:  
    "Sorry, I couldn't find any specific information in the transcript to answer your question."
    No external knowledge allowed.
    The reply should be in the same language as the user question always.

    User's question:
    {user_prompt}

    Transcript:
    {transcript}
    """