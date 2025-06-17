"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createInvoice(formData: FormData) {
	const { customerId, amount, status } = {
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	};
	const amountInCents = Number(amount) * 100;
	const date = new Date().toISOString().split("T")[0];

	await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
}
