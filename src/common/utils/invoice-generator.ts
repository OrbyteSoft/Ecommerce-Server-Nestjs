import PDFDocument from 'pdfkit';
import streamBuffers from 'stream-buffers';

interface InvoiceOrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface InvoiceOrder {
  orderNumber: string;
  createdAt: Date;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  shippingAddress: any;
  billingAddress: any;
  items: InvoiceOrderItem[];
  payment?: { method: string; status: string; reference?: string };
}

export const generateInvoicePDFBuffer = async (order: InvoiceOrder) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const bufferStream = new streamBuffers.WritableStreamBuffer();
  doc.pipe(bufferStream);

  // Helper for consistent right-aligned text
  const rightAlign = (text: string, yPos: number) =>
    doc.text(text, 400, yPos, { align: 'right', width: 145 });

  // --- Header ---
  doc
    .fontSize(20)
    .text('Just Click Pvt. Ltd', { align: 'center' })
    .moveDown(0.5);
  doc.fontSize(10).text(`Invoice: ${order.orderNumber}`, { align: 'right' });
  doc.text(`Date: ${order.createdAt.toLocaleDateString()}`, { align: 'right' });
  doc.moveDown();

  // --- Addresses ---
  const startY = doc.y;
  doc.fontSize(12).text('Billing Address:', { underline: true }).fontSize(10);
  doc.text(
    `${order.billingAddress.line1}\n${order.billingAddress.city}, ${order.billingAddress.state || ''}\n${order.billingAddress.country} - ${order.billingAddress.zipCode}`,
  );

  doc.y = startY; // Reset Y to align shipping next to billing
  doc
    .fontSize(12)
    .text('Shipping Address:', 300, startY, { underline: true })
    .fontSize(10);
  doc.text(
    `${order.shippingAddress.line1}\n${order.shippingAddress.city}, ${order.shippingAddress.state || ''}\n${order.shippingAddress.country} - ${order.shippingAddress.zipCode}`,
    300,
  );

  doc.moveDown(4);

  // --- Table Header ---
  const tableTop = doc.y;
  const colX = { name: 50, qty: 280, price: 350, total: 450 };

  doc.fontSize(12).font('Helvetica-Bold');
  doc.text('Product', colX.name, tableTop);
  doc.text('Qty', colX.qty, tableTop);
  doc.text('Price', colX.price, tableTop);
  doc.text('Total', colX.total, tableTop);
  doc.font('Helvetica').fontSize(10);

  let y = tableTop + 25;

  // --- Items Loop with Wrap Support ---
  for (const item of order.items) {
    const itemTotal = (item.quantity * item.price).toFixed(2);

    // Calculate height of the product name wrap
    const nameHeight = doc.heightOfString(item.productName, { width: 220 });

    // Check for page overflow
    if (y + nameHeight > 750) {
      doc.addPage();
      y = 50;
    }

    doc.text(item.productName, colX.name, y, { width: 220 });
    doc.text(item.quantity.toString(), colX.qty, y);
    doc.text(item.price.toFixed(2), colX.price, y);
    doc.text(itemTotal, colX.total, y);

    y += Math.max(nameHeight, 20) + 5; // Dynamic spacing
  }

  // --- Summary ---
  y += 20;
  doc.moveTo(50, y).lineTo(550, y).stroke(); // Divider line
  y += 10;

  const summary = [
    { label: 'Subtotal:', value: order.subtotal.toFixed(2) },
    { label: 'Tax (13%):', value: order.tax.toFixed(2) },
    { label: 'Shipping:', value: order.shippingFee.toFixed(2) },
    { label: 'Total:', value: order.total.toFixed(2) },
  ];

  summary.forEach((item) => {
    doc.font('Helvetica-Bold').text(item.label, 350, y);
    doc.font('Helvetica').text(item.value, colX.total, y);
    y += 15;
  });

  doc.end();

  await new Promise<void>((resolve) => bufferStream.on('finish', resolve));
  return bufferStream.getContents();
};
