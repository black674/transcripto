export const mergeTranscriptSegments = (transcript, language) => {
  if (!transcript || transcript.length === 0) return [];

  const mergedSegments = [];
  const chunkSize = language.includes("auto-generated") ? 6 : 4;

  for (let i = 0; i < transcript.length; i += chunkSize) {
    const chunk = transcript.slice(i, i + chunkSize);

    const startTime = chunk[0].start;

    const combinedText = chunk.map((segment) => segment.text).join(" ");

    mergedSegments.push({
      start: startTime,
      text: combinedText,
    });
  }

  return mergedSegments;
};

export const isActiveSegment = (
  segment,
  mergedTranscript,
  currentTime,
  index
) => {
  const nextSegment = mergedTranscript[index + 1];
  const startTime = segment.start;
  const endTime = nextSegment ? nextSegment.start : Infinity;
  return currentTime >= startTime && currentTime < endTime;
};
