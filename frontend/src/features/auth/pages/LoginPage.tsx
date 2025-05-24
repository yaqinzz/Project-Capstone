import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { RegisterFormInner } from "../components/RegisterFormInner";
import { type RegisterFormSchema, registerFormScema } from "../forms/register";
import { supabase } from "~/lib/supabase/client";
import { type AuthError } from "@supabase/supabase-js";
import { SupabaseAuthErrorCode } from "~/lib/supabase/authErrorCodes";
import { toast } from "sonner";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormScema),
  });
  const router = useRouter();
  const handleLoginSubmit = async (values: RegisterFormSchema) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;

      await router.replace("/");
    } catch (error) {
      switch ((error as AuthError).code) {
        case SupabaseAuthErrorCode.invalid_credentials:
          form.setError("email", { message: "Email or Password incorrect!" });
          form.setError("password", {
            message: "Email or Password incorrect!",
          });
          break;
        case SupabaseAuthErrorCode.email_not_confirmed:
          form.setError("email", { message: "Email has not been verified" });
          break;
        default:
          toast.error("An error occurred, try again in a moment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer withHeader={false} withFooter={false}>
      <SectionContainer
        padded
        className="flex min-h-[calc(120vh-144px)] w-full flex-col justify-center"
      >
        <Card className="w-full max-w-[480px] self-center">
          <CardHeader className="flex flex-col items-center justify-center">
            {/* Logo Here */}
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-muted-foreground">Please log in to continue</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <RegisterFormInner
                buttonText="Log In"
                onRegisterSubmit={handleLoginSubmit}
                isLoading={isLoading}
              />
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-6">
            {/* <div className="flex w-full items-center justify-between gap-x-4">
              <div className="h-[2px] w-full border-t-2" />
              <p className="flex-1 text-nowrap text-sm text-muted-foreground">
                Atau lanjut dengan
              </p>
              <div className="h-[2px] w-full border-t-2" />
            </div>
            <Button
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              <FcGoogle />
              Buat Akun dengan Google
            </Button> */}
            <p>
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-purple-600">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};

export default LoginPage;
