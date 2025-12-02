"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Gem,
  CheckCircle,
  Target,
  ShieldQuestion,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPackages,
  logoutUser,
  saveInitialInventory,
} from "@/utils/api/user";
import {
  PackageData,
  PackageProductType,
  PackagesNames,
  PackagesStyles,
  ProductActionsStyles,
  // ProductCategoriesStyles,
} from "@/utils/types/store";
import { toast } from "sonner";

export default function FirstInventorySelector() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const { isLoading, data } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
  });

  const { mutate: saveSelectedPackage, isPending: savingPackage } = useMutation(
    {
      mutationKey: ["save-package"],
      mutationFn: saveInitialInventory,
      onSuccess: (data) => {
        if(!data.success) {
          toast.error(data.message, {description: "Favor, tente novamente."})
        }
      },
      onError: (error) => {
        toast.error(error.name, {description: error.message})
      }
    }
  );

  const handlePackageSelect = (packageId: string) => {
    if (selectedPackage === packageId) {
      setSelectedPackage(null); // Desselecionar se já estiver selecionado
    } else {
      setSelectedPackage(packageId);
    }
  };

  const handleConfirm = () => {
    if (selectedPackage) {
      const selected: PackageData = data.find(
        (pkg: PackageData) => pkg.id === selectedPackage
      );
      saveSelectedPackage(selected.id as PackagesNames);
    }
  };

  const calculateTotalValue = (products: PackageProductType[]) => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 animate-pulse">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4 justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div className="h-6 w-64 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-80 rounded mx-auto" />
          </div>

          {/* Pacotes (3 cards de exemplo) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-4 border rounded-lg shadow-sm"
              >
                {/* Header do Card */}
                <div className="text-center pb-4">
                  <div className="mx-auto mb-3 w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="h-4 w-24 bg-gray-300 rounded mx-auto mb-2" />
                  <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
                </div>

                {/* Produtos dentro do card */}
                <div className="space-y-3 grow">
                  {Array.from({ length: 2 }).map((_, productIdx) => (
                    <div
                      key={productIdx}
                      className="p-3 bg-gray-50 rounded-lg space-y-2"
                    >
                      <div className="flex items-start flex-wrap gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-40 bg-gray-300 rounded" />
                          <div className="h-2 w-20 bg-gray-200 rounded" />
                        </div>
                        <div className="flex-shrink-0 space-y-1 text-right">
                          <div className="h-2 w-10 bg-gray-200 rounded" />
                          <div className="h-4 w-12 bg-gray-300 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer com valor total */}
                <div className="border-t pt-4 mt-4 w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-gray-300 rounded" />
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-3 w-14 bg-gray-200 rounded" />
                      <div className="h-5 w-16 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-48 bg-gray-200 rounded mx-auto" />
                </div>
              </div>
            ))}
          </div>

          {/* Botão de Continuar (opcional mostrar no loading) */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-8 py-3 bg-gray-300 text-white rounded-lg shadow w-60 h-12" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Button
        className="text-ctf-red mb-3"
        variant={"outline"}
        onClick={() => {
          // toast.warning("Você realmente deja sair do sistema?", {action: {label: "Sim, sair!", onClick: logoutUser}, closeButton: true})

          toast.warning("Você realmente deja sair do sistema?", {
            action: {
              label: "Sim, sair!",
              onClick: () => logoutUser(),
            },
            closeButton: true,
          });
        }}
      >
        <LogOut className="mr-2 h-4 w-4 rotate-180" />
        <span>Sair</span>
      </Button>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-ctf-blue" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Escolha seu Pacote Inicial
            </h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto">
            Selecione <span className="font-bold text-ctf-blue">1 pacote</span>{" "}
            para iniciar sua jornada na Arena e desbloquear ferramentas
            especiais gratuitamente!
          </p>
        </div>

        {/* Package Cards - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {data &&
            data.map((pkg: PackageData) => {
              const isSelected = selectedPackage === pkg.id;

              const color = PackagesStyles[pkg.id]?.color || "bg-pink-500";

              const IconComponent =
                PackagesStyles[pkg.id]?.icon || ShieldQuestion;

              const totalValue = pkg.products
                ? calculateTotalValue(pkg.products)
                : 0;

              return (
                <Card
                  key={pkg.id}
                  className={`
                  justify-between relative cursor-pointer transition-all duration-200 hover:shadow-lg
                  ${
                    isSelected
                      ? `border-ctf-blue border-2 shadow-xl`
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-ctf-blue text-foreground rounded-full p-1.5 shadow-lg">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    {/* Package Icon */}
                    <div
                      className={`mx-auto mb-3 w-12 h-12 rounded-lg shadow-sm flex items-center justify-center ${color}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <CardTitle className="text-lg font-bold mb-2">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-sm">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-3 grow">
                    {pkg.products &&
                      pkg.products.map(
                        (product: PackageProductType, index: number) => {
                          // const ProductIcon =
                          //   ProductCategoriesStyles[product.category].icon;
                          // const color =
                          //   ProductCategoriesStyles[product.category].color;
                          const ProductIcon =
                            ProductActionsStyles[product.action].icon;
                          const color =
                            ProductActionsStyles[product.action].color;

                          const totalProductPrice =
                            product.price * product.quantity;

                          return (
                            <div key={index} className="space-y-2 bg-secondary-foreground">
                              {/* Product Item */}
                              <div className="flex items-start flex-wrap gap-3 p-3 rounded-lg">
                                <div className="flex items-center justify-center gap-2 flex-1 flex-wrap">
                                  <ProductIcon className="w-4 h-4 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {product.quantity}x {product.name}
                                    </div>
                                    <Badge
                                      className={`${color} whitespace-normal text-xs px-2 py-0.5 mt-1`}
                                    >
                                      {product.category}
                                    </Badge>
                                  </div>
                                </div>
                                {/* Price */}
                                <div className="text-right flex-shrink-0">
                                  <div className="flex items-center gap-1 text-xs line-through">
                                    <Gem className="w-3 h-3" />
                                    <span>{totalProductPrice}</span>
                                  </div>
                                  <div className="text-sm font-bold text-ctf-green">
                                    Grátis
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </CardContent>

                  <CardFooter className="flex-col items-baseline justify-normal">
                    {/* Total Value */}
                    <div className="border-t pt-4 mt-4 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          Valor total:
                        </span>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 font-bold text-sm text-ctf-red line-through opacity-80">
                            <Gem className="w-3 h-3" />
                            <span>{totalValue.toLocaleString()}</span>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            Grátis
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection Status */}
                    <div className="text-center pt-2 w-full">
                      {isSelected ? (
                        <p className="text-sm font-medium text-ctf-blue">
                          ✓ Pacote selecionado - Clique novamente para
                          desselecionar
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Clique para selecionar este pacote
                        </p>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        {/* Continue Button */}
        {selectedPackage && (
          <div className="text-center">
            <Button
              onClick={handleConfirm}
              disabled={savingPackage}
              size="lg"
              className="bg-ctf-blue hover:bg-ctf-blue/85 text-white font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {savingPackage ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5 mr-2" />
                  Salvando pacote inicial...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Continuar para a Arena
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
