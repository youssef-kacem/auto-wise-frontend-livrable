import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePayment } from "@/hooks/payment";
import {
  PaymentStatus,
  PaymentRecap,
  Breadcrumbs,
  PaymentSkeleton,
  NotFoundMessage
} from "@/components/payment";
import jsPDF from "jspdf";

export default function Payment() {
  const {
    reservation,
    car,
    loading,
    paymentStatus,
    setPaymentStatus,
    id
  } = usePayment();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <PaymentSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!reservation || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <NotFoundMessage />
        </main>
        <Footer />
      </div>
    );
  }

  // Fonction pour générer la facture PDF
  const generatePDF = async () => {
    const doc = new jsPDF();
    // Logo (utilisation du chemin public)
    const img = new Image();
    img.src = "/autowise-logo.png";
    await new Promise((resolve) => { img.onload = resolve; });
    doc.addImage(img, "PNG", 10, 10, 40, 20);
    // Titre
    doc.setFontSize(22);
    doc.text("FACTURE", 60, 20);
    // Infos société
    doc.setFontSize(10);
    doc.text("AutoWise - Car Rental Car Share", 10, 35);
    doc.text("Adresse: 123 Rue Principale, Ville, Pays", 10, 40);
    doc.text("Email: car@autowise.com", 10, 45);
    doc.text("Téléphone: 01 23 45 67 89", 10, 50);
    // Infos client
    doc.setFontSize(12);
    doc.text("Client:", 10, 60);
    doc.setFontSize(10);
    doc.text(`ID client: ${reservation.userId || "-"}`, 10, 65);
    doc.text(`Date de réservation: ${reservation.createdAt ? new Date(reservation.createdAt).toLocaleDateString() : "-"}`, 10, 70);
    // Détails réservation
    doc.setFontSize(12);
    doc.text("Détails de la réservation:", 10, 80);
    doc.setFontSize(10);
    let y = 85;
    doc.text(`Véhicule: ${car ? car.brand + " " + car.model : reservation.carId}`, 10, y);
    y += 5;
    doc.text(`Période: ${reservation.startDate} - ${reservation.endDate}`, 10, y);
    y += 5;
    doc.text(`Options: ${reservation.withDriver ? "Chauffeur, " : ""}${reservation.withGPS ? "GPS, " : ""}${reservation.withChildSeat ? "Siège enfant" : ""}`.replace(/, $/, "") || "Aucune", 10, y);
    y += 10;
    // Tableau prix
    doc.setFontSize(11);
    doc.text("Récapitulatif:", 10, y);
    y += 5;
    doc.autoTable({
      startY: y,
      head: [["Description", "Montant (TND)"]],
      body: [
        ["Prix de base", `${reservation.totalPrice} TND`],
        ...(reservation.withDriver ? [["Option chauffeur", "Incluse"]] : []),
        ...(reservation.withGPS ? [["GPS", "Inclus"]] : []),
        ...(reservation.withChildSeat ? [["Siège enfant", "Inclus"]] : []),
        ["Total", `${reservation.totalPrice} TND`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: 10, right: 10 },
    });
    y = doc.lastAutoTable.finalY + 10;
    // Méthode de paiement
    doc.setFontSize(10);
    doc.text(`Méthode de paiement: ${reservation.paymentMethod || "Non renseignée"}`, 10, y);
    y += 10;
    // Date et signature
    doc.text(`Date d'édition: ${new Date().toLocaleDateString()}`, 10, y);
    doc.text("Signature: ______________________", 120, y);
    // Téléchargement
    doc.save(`facture_autowise_${reservation.id}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto max-w-3xl px-4">
          <Breadcrumbs />
          
          <PaymentStatus 
            status={paymentStatus} 
            reservationId={id} 
            setPaymentStatus={setPaymentStatus} 
          />
          
          {/* Récapitulatif de la réservation */}
          <PaymentRecap reservation={reservation} />
          {/* Bouton PDF */}
          <button
            onClick={generatePDF}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Télécharger la facture PDF
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
