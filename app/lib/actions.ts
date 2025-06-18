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

	try {
		await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
	} catch (e) {
		console.error(e);
	}

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
	const { customerId, amount, status } = {
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status"),
	};
	const amountInCents = Number(amount) * 100;

	try {
		await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
	} catch (e) {
		console.error(e);
	}

	revalidatePath("/dashboard/invoices");
	redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
	throw new Error("Failed to Delete Invoice");

	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`;
	} catch (e) {
		console.error(e);
	}

	revalidatePath("/dashboard/invoices");
}
