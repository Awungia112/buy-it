"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Redirect back to the order page to show updated status
    redirect(`/admin/orders/${orderId}`);
  } catch (error) {
    console.error('Order status update error:', error);
    throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}