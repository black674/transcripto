import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useModal } from "@/lib/modalContext/ModalContext";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupModal = () => {
  const { isSignupOpen, closeSignupModal, openLoginModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSwitchToLogin = () => {
    reset();
    closeSignupModal();
    openLoginModal();
  };

  const onSubmit = async (formData) => {
    setSignupError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to register");
      }

      toast.success("Success", {
        description: data.message,
      });

      reset();
      onSwitchToLogin();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      setSignupError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isSignupOpen} onClose={closeSignupModal}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
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

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className="w-full border-[#CCCCCC] rounded-md"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1E88E5] hover:bg-[#1976D2] text-white disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
          {signupError && (
            <p className="text-red-500 text-sm text-center">{signupError}</p>
          )}
        </form>
        <div className="text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-[#1E88E5] hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SignupModal;
