
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponseType } from "@/types/ApiResponse";

export async function sendVerificatoinEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponseType> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification code sent" };
  } catch (error) {
    console.log("Error while sending email verification email", error);
    return {
      success: false,
      message: "Error while sending verification Email",
    };
  }
}
