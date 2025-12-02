"use client";

import { useState, useEffect } from "react";
import { Plus, Save, ShieldQuestion, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EditProductType,
  ProductType,
  PackagesNamesEnum,
  PackageAtProductType,
  PackagesNames,
  ProductActionsStyles,
  PackagesReverseNamesEnum,
  PackagesStyles,
} from "@/utils/types/store";
import SubmitButton from "@/components/submit-button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { clearUnmodifiedObjectKeys } from "@/utils/objects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
  onSave: (product: Partial<EditProductType>) => void;
}

export default function EditProductForms({
  product,
  open,
  onOpenChange,
  onSave,
}: ProductEditDialogProps) {
  const [formData, setFormData] = useState<Partial<EditProductType> | null>(
    product
  );
  const [wasChanged, setWasChanged] = useState(false);

  const [currentPackage, setCurrentPackage] = useState<PackageAtProductType>({
    package_name: "basic",
    package_quantity: 0,
  });

  const [packages, setPackages] = useState<PackageAtProductType[]>(
    product?.packages && product.packages.length > 0 ? product.packages : []
  );

  const [includesOnInitialInventory, setIncludesOnInitialInventory] =
    useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;

    setPackages(product.packages ?? []);
    setIncludesOnInitialInventory((product.packages?.length ?? 0) > 0);

    const someValueWasChange = clearUnmodifiedObjectKeys(formData!, product!);
    setWasChanged(!!someValueWasChange);
  }, [formData, product]);

  const handleInputChange = (field: keyof ProductType, value: unknown) => {
    if (!formData) return;
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setWasChanged(true);
  };

  const handleSave = () => {
    if (!formData) return;
    onSave({ ...formData, packages });
    setIncludesOnInitialInventory(false);
    setPackages([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(product);
    setPackages(product?.packages ?? []);
    setIncludesOnInitialInventory((product?.packages?.length ?? 0) > 0);
    onOpenChange(false);
  };

  const handleOpenChange = (currentOpenState: boolean) => {
    // setIncludesOnInitialInventory(false);
    // setPackages([]);
    onOpenChange(currentOpenState);

    if (!currentOpenState) {
      // se estamos fechando, restaure ao inicial
      setFormData(product);
      setPackages(product?.packages ?? []);
      setIncludesOnInitialInventory((product?.packages?.length ?? 0) > 0);
    }
  };

  const handleAddPackage = () => {
    if (!currentPackage.package_name || currentPackage.package_quantity <= 0)
      return;

    const alreadyExists = packages.some(
      (pkg) => pkg.package_name === currentPackage.package_name
    );

    if (!alreadyExists) {
      const updated = [...packages, currentPackage];
      setPackages(updated);
      setCurrentPackage({ package_name: "basic", package_quantity: 0 });
      setWasChanged(true);
    }
  };

  const removePackage = (name: PackagesNames) => {
    setPackages((prev) => prev.filter((p) => p.package_name !== name));
    setWasChanged(true);
  };

  if (!formData || !product) return null;

  // const Icon =
  //   ProductCategoriesStyles[product!.category].icon ?? ShieldQuestion;
  // const color =
  //   ProductCategoriesStyles[product!.category].color ?? "bg-blue-500";

  const actionStyle = ProductActionsStyles[product.action];
  const ActionIcon = actionStyle.icon;
  const ActionColor = actionStyle.color;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto p-5 w-full">
        <SheetHeader className="p-0">
          <SheetTitle className="flex gap-3 text-xl">
            <div className={`p-2 rounded-lg ${ActionColor}`}>
              <ActionIcon className="h-5 w-5 text-white" />
            </div>
            Editando produto
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 grow">
          <h2 className="text-xl">{product?.name}</h2>

          <div className="space-y-3">
            <Label htmlFor="max-purchases">
              Max. de compras <span className="text-red-600">*</span>
            </Label>
            <Input
              id="max-purchases"
              type="number"
              min="1"
              max="999"
              step={1}
              required
              value={formData.max_purchases}
              onInput={(e) => {
                if (e.currentTarget.value.length > 3) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 3);
                }
              }}
              onChange={(e) => {
                return handleInputChange(
                  "max_purchases",
                  parseInt(e.currentTarget.value, 10)
                );
              }}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="price">
              Valor do produto <span className="text-red-600">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              min="1"
              max="9999999"
              required
              value={formData.price}
              onInput={(e) => {
                if (e.currentTarget.value.length > 3) {
                  e.currentTarget.value = e.currentTarget.value.slice(0, 7);
                }
              }}
              onChange={(e) =>
                handleInputChange("price", parseInt(e.target.value, 10))
              }
            />
          </div>

          <div className="flex flex-col gap-2 my-3">
            <h2>Visibilidade | Inventário inicial</h2>
            <div className="flex gap-3 flex-wrap justify-between">
              <div className="flex gap-2 items-center">
                <Label htmlFor="visibility">Deixar visível?</Label>
                <Switch
                  id="visibility"
                  checked={!formData.hidden}
                  onCheckedChange={(checked) =>
                    handleInputChange("hidden", !checked)
                  }
                />
              </div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="initial-inventory">
                  Adicionar aos pacotes do inventário inicial?
                </Label>
                <Switch
                  id="initial-inventory"
                  checked={includesOnInitialInventory}
                  onCheckedChange={() =>
                    setIncludesOnInitialInventory((old) => !old)
                  }
                />
              </div>
            </div>
          </div>

          {includesOnInitialInventory && (
            <>
              <div className="flex flex-col gap-2">
                <Label>
                  Pacote inicial <span className="text-red-600">*</span>
                </Label>
                <Select
                  value={
                    currentPackage.package_name as PackagesReverseNamesEnum
                  }
                  onValueChange={(value) =>
                    setCurrentPackage((old) => {
                      if (old) {
                        return {
                          ...old,
                          package_name: value as PackagesNamesEnum,
                        };
                      }

                      return {
                        package_quantity: 0,
                        package_name: value as PackagesNamesEnum,
                      };
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pacote" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PackagesNamesEnum).map((name) => {
                      const alreadyAdded = packages.some(
                        (pkg) => pkg.package_name === name
                      );

                      const IconComponent =
                        PackagesStyles[name]?.icon || ShieldQuestion;
                      return (
                        <SelectItem
                          key={name}
                          value={name}
                          disabled={alreadyAdded}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-3 w-3" />
                            {PackagesReverseNamesEnum[name]}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  Quantidade <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={currentPackage.package_quantity}
                  onChange={(e) => {
                    const newPackageQuantity = e.currentTarget.value;
                    setCurrentPackage((old) => {
                      if (old) {
                        return {
                          ...old,
                          package_quantity: parseInt(newPackageQuantity, 10),
                        };
                      }

                      return {
                        package_name: "basic",
                        package_quantity: parseInt(newPackageQuantity, 10),
                      };
                    });
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddPackage}
              >
                <Plus className="h-4 w-4 mr-1" />
                Confirmar adição
              </Button>
            </>
          )}

          {includesOnInitialInventory && packages.length > 0 ? (
            <div className="border-t pt-4 space-y-2">
              <Label className="text-sm font-medium">Pacotes atrelados</Label>
              <ul className="space-y-1 text-sm">
                {packages.map((p, index) => {
                  const color =
                    PackagesStyles[p.package_name]?.color || "bg-pink-500";

                  const IconComponent =
                    PackagesStyles[p.package_name]?.icon || ShieldQuestion;

                  return (
                    <li
                      key={index}
                      className="flex justify-between items-start border-2 px-3 py-2 rounded"
                    >
                      <div className="flex gap-3 items-center flex-wrap">
                        {/* <IconComponent  className={`w-6 h-6 p-2 ${color}`}/> */}
                        <div
                          className={`w-8 h-8 rounded-lg shadow-sm flex items-center justify-center ${color}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <strong>
                          {PackagesReverseNamesEnum[p.package_name]}
                        </strong>{" "}
                        - {p.package_quantity} un.
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePackage(p.package_name)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : includesOnInitialInventory ? (
            <div className="grow flex items-center justify-center opacity-75 text-center text-base">
              <p>Este produto não está em nenhum pacote inicial ainda!</p>
            </div>
          ) : null}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
          <SubmitButton onClick={handleSave} disabled={!wasChanged}>
            <Save className="h-4 w-4 mr-2" />
            Salvar alterações
          </SubmitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
