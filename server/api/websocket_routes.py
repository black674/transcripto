from fastapi import WebSocket, WebSocketDisconnect
import httpx
import json
import os
from ai_prompts import SYSTEM_PROMPT, build_summary_prompt, build_qa_prompt, build_custom_prompt, build_highlights_prompt, build_study_guide_prompt

from app import app

# ... existing code ...
@app.websocket("/ai-chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    while True:
        try:
            data = await websocket.receive_text()
            json_data = json.loads(data)

            task = json_data.get("task")
            transcript = json_data.get("transcript")

            if not task or not transcript:
                await websocket.send_text(json.dumps({"type": "error", "message": "Missing task or transcript."}))
                continue

            if task == "summary":
                prompt = build_summary_prompt(transcript)
            elif task == "qa":
                prompt = build_qa_prompt(transcript)
            elif task == "highlight":
                prompt = build_highlights_prompt(transcript)
            elif task == "study_guide":
                prompt = build_study_guide_prompt(transcript)
            else:
                prompt = build_custom_prompt(task, transcript)

            headers = {
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json"
            }

            data = {
                "model": os.getenv("OPENROUTER_MODEL"),
                "stream": True,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ]
            }

            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream("POST", "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        await websocket.send_text(json.dumps({"type": "error", "message": f"OpenRouter API error: {response.status_code} - {error_text.decode()}"}))
                        continue

                    async for line in response.aiter_lines():
                        if line.strip().startswith("data: "):
                            content = line.removeprefix("data: ").strip()
                            if content == "[DONE]":
                                await websocket.send_text(json.dumps({"type": "done"}))
                                break
                            try:
                                chunk = json.loads(content)
                                delta = chunk["choices"][0]["delta"].get("content")
                                if delta:
                                    await websocket.send_text(json.dumps({"type": "stream", "content": delta}))
                            except Exception as parse_error:
                                await websocket.send_text(json.dumps({"type": "error", "message": str(parse_error)}))

        except WebSocketDisconnect:
            print("🔌 WebSocket client disconnected.")
            break

        except Exception as e:
            await websocket.send_text(json.dumps({"type": "error", "message": str(e)})) 