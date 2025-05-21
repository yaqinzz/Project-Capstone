import { z } from "zod";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { passwordSchema } from "~/schemas/auth";
import { generateFromEmail } from "unique-username-generator";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: passwordSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { email, password } = input;

      // Cek apakah email sudah terdaftar
      const existingUser = await db.profile.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("Email sudah terdaftar.");
      }

      await db.$transaction(async (tx) => {
        let userId = "";
        try {
          const { data, error } =
            await supabaseAdminClient.auth.admin.createUser({
              email,
              password,
            });

          if (data.user) {
            userId = data.user.id;
          }
          if (error) throw error;

          const generatedUsername = generateFromEmail(email);
          await tx.profile.create({
            data: {
              email,
              userId: data.user.id,
              username: generatedUsername,
            },
          });
        } catch (error) {
          console.log(error);
          if (userId) {
            await supabaseAdminClient.auth.admin.deleteUser(userId);
          }
          throw new Error("Gagal mendaftar. Silakan coba lagi.");
        }
      });
    }),
});
