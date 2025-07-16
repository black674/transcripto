import { toast } from "sonner";

export const copyToClipboard = (text, messageText) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied!", {
    description: messageText,
  });
};
