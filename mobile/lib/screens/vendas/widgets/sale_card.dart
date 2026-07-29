import 'package:flutter/material.dart';
import '../../../models/sales_invoice.dart';

class SaleCard extends StatelessWidget {
  final SalesInvoice sale;
  final VoidCallback? onReceive;
  final VoidCallback? onTap;

  const SaleCard({
    super.key,
    required this.sale,
    this.onReceive,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color statusColor = sale.isPaid
        ? Colors.green
        : sale.isPartial
            ? Colors.orange
            : Colors.red;

    return Card(
      margin: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 6,
      ),
      elevation: 2,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.start,
            children: [

              Text(
                sale.name,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),

              const SizedBox(height: 8),

              Text(
  "${sale.postingDate.day.toString().padLeft(2,'0')}/"
  "${sale.postingDate.month.toString().padLeft(2,'0')}/"
  "${sale.postingDate.year}",
  style: const TextStyle(
    color: Colors.grey,
    fontSize: 12,
  ),
),

              const SizedBox(height: 10),

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,
                children: [

                  Text(
                    "Total",
                    style: TextStyle(
                      color: Colors.grey.shade600,
                    ),
                  ),

                  Text(
                    "R\$ ${sale.grandTotal.toStringAsFixed(2)}",
                  ),

                ],
              ),

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,
                children: [

                  Text(
                    "Pago",
                    style: TextStyle(
                      color: Colors.grey.shade600,
                    ),
                  ),

                  Text(
                    "R\$ ${sale.paidAmount.toStringAsFixed(2)}",
                  ),

                ],
              ),

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,
                children: [

                  Text(
                    "Saldo",
                    style: TextStyle(
                      color: Colors.grey.shade600,
                    ),
                  ),

                  Text(
                    "R\$ ${sale.outstandingAmount.toStringAsFixed(2)}",
                  ),

                ],
              ),

              const SizedBox(height: 12),

              Row(
                children: [

                  Icon(
                    Icons.circle,
                    color: statusColor,
                    size: 12,
                  ),

                  const SizedBox(width: 8),

                  Text(
                    sale.statusLabel,
                    style: TextStyle(
                      color: statusColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const Spacer(),

                  if (!sale.isPaid)

                    ElevatedButton.icon(
                      onPressed: onReceive,
                      icon: const Icon(Icons.payments),
                      label: const Text("Receber"),
                    ),

                ],
              ),

            ],
          ),
        ),
      ),
    );
  }
}