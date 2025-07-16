import { Card } from "@/components/ui/card";

export default function NoCaption() {
  return (
    <Card className="w-full lg:w-[47%] h-[570px]">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="text-4xl text-gray-300">📝</div>
        <h3 className="text-lg font-medium text-gray-500">
          No Captions Available
        </h3>
        <p className="text-sm text-gray-400">
          We couldn't find any captions for this video.
        </p>
      </div>
    </Card>
  );
}
