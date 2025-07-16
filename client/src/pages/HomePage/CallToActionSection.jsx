import { Button } from "@/components/ui/button";
import { UseAuth } from "@/lib/auth/AuthContext";
import { useModal } from "@/lib/modalContext/ModalContext";

export default function CallToActionSection() {
  const { isAuthenticated, isLoading } = UseAuth();
  const { openLoginModal } = useModal();

  if (!isAuthenticated && !isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1565C0] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Start Now—Get Your First Transcript Free
          </h2>
          <p className="mb-8 text-lg">
            No credit card required. Try our service today and experience the
            power of automatic transcription.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#1565C0] hover:bg-blue-50"
            onClick={openLoginModal}
          >
            Sign Up Free
          </Button>
        </div>
      </section>
    );
  }
}
