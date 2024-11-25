import React from 'react';
import CourseCertificate from '../components/CourseCertificate';
import { Button } from "@/components/ui/button"

const CertificatePage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handlePrint}
            className="print:hidden"
          >
            Download Certificate
          </Button>
        </div>
        <CourseCertificate />
      </div>
    </div>
  );
};

export default CertificatePage;

