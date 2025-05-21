import { useRouter } from "next/router";
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
import { api } from "~/utils/api";
import { toast } from "sonner";

const RegisterPage = () => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormScema),
  });
  const router = useRouter();

  const { mutate: registerUser, isPending: registerUserIsPending } =
    api.auth.register.useMutation({
      onSuccess: () => {
        toast.success("Akun berhasil dibuat! Silahkan login.");
        form.setValue("email", "");
        form.setValue("password", "");

        void router.push("/login");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  const handleRegisterSubmit = (values: RegisterFormSchema) => {
    registerUser(values);
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
            <h1 className="text-3xl font-bold text-primary">
              Create an Account
            </h1>
            <p className="text-muted-foreground">
              Register and start exploring!
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <RegisterFormInner
                buttonText="Register"
                isLoading={registerUserIsPending}
                onRegisterSubmit={handleRegisterSubmit}
              />
            </Form>
            {/* CONTINUE WITH GOOGLE */}
          </CardContent>
          <CardFooter className="flex flex-col gap-6">
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="h-[2px] w-full border-t-2" />
              <p className="flex-1 text-nowrap text-sm text-muted-foreground">
                Or continue with
              </p>
              <div className="h-[2px] w-full border-t-2" />
            </div>
            <Button variant="secondary" className="w-full" size="lg">
              <FcGoogle />
              Create an Account with Google
            </Button>
            <p>
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-purple-600">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </SectionContainer>
    </PageContainer>
  );
};

export default RegisterPage;
