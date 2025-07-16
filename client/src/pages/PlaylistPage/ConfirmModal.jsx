import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

export default function ConfirmModal({
  isModalOpen,
  setIsModalOpen,
  selectedVideoCount,
  handleConfirmFetch,
}) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Transcript Extraction</DialogTitle>
          <DialogDescription className="pt-4">
            This operation will consume up to {selectedVideoCount} tokens. If a
            transcript was already fetched before, a token will not be consumed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="sm:mr-2 w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmFetch}
            className="w-full sm:w-auto bg-[#42A5F5] hover:bg-[#2196F3]"
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
