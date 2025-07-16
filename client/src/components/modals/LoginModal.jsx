import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";
import { useModal } from "@/lib/modalContext/ModalContext";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = () => {
  const { login } = UseAuth();
  const { isLoginOpen, closeLoginModal, openSignupModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSwitchToSignup = () => {
    reset();
    closeLoginModal();
    openSignupModal();
  };

  const onSubmit = async (formData) => {
    setLoginError("");
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to login");
      }

      const data = await response.json();
      await login(data.session);
      toast.success("Success", {
        description: "Logged in successfully",
      });

      reset();
      closeLoginModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setLoginError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={closeLoginModal}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border-[#CCCCCC] rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border-[#CCCCCC] rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}
        </form>
        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-[#1E88E5] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
