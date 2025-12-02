"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listStoreItems } from "@/utils/api/store";
import {
  EditProductType,
  ProductType,
  StoreItemsListType,
} from "@/utils/types/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Box, Edit, Gem, Trash2 } from "lucide-react";
import { Box, Edit, Gem } from "lucide-react";
import EditProductForms from "./edit-product";
import { useState } from "react";
import { toast } from "sonner";
// import { deleteProduct, updateProduct } from "@/utils/api/admin";
import { updateProduct } from "@/utils/api/admin";
import { clearUnmodifiedObjectKeys } from "@/utils/objects";

export default function ItemsList({
  itemsList,
}: {
  itemsList: StoreItemsListType | null;
}) {
  const queryClient = useQueryClient();

  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const {data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await listStoreItems().then((data) => data.data ?? []),
    placeholderData: itemsList,
  });

  const updateProductMutation = useMutation({
    mutationKey: ["products"],
    mutationFn: async (product: Partial<EditProductType>) => {
      if (
        editingProduct &&
        clearUnmodifiedObjectKeys(editingProduct, product)
      ) {
        return await updateProduct(
          clearUnmodifiedObjectKeys(editingProduct, product)!,
          editingProduct.id
        );
      }
    },
    onSuccess(data) {
      if (data.success) {
        // setFormData(defaultEmptyProduct);

        toast.dismiss("edit-product");
        toast.success("Atualizado com sucesso!");

        queryClient.setQueryData(["products"], (oldData: ProductType[]) => {
          return oldData.map((product) =>
            product.id == data.data.id ? data.data : product
          );
        });
      } else {
        toast.error("Algo deu errado! Favor tente novamente.", {
          description: data.message,
        });
      }
    },
    onError(error) {
      toast.error("Algo deu errado! Favor tente novamente.", {
        description: error.message,
      });
    },
  });

  // const deleteProductMutation = useMutation({
  //   mutationKey: ["products"],
  //   mutationFn: async (product: ProductType) => await deleteProduct(product.id),
  //   onSuccess(data, product) {
  //     if (data.success) {
  //       toast.dismiss("delete-product");
  //       toast.success(`Produto ${product.name} deletado com sucesso!`);

  //       queryClient.setQueryData(["products"], (oldData: ProductType[]) =>
  //         oldData.filter((oldProduct) => oldProduct.id !== product.id)
  //       );
  //     } else {
  //       toast.error("Erro ao deletar produto", {
  //         description: data.message,
  //       });
  //     }
  //   },
  //   onError(error) {
  //     toast.error("Algo deu errado!", {
  //       description: error.message,
  //     });
  //   },
  // });

  // const handleDeleteProduct = (product: ProductType) => {
  //   toast.warning(`Atenção! Confirmação necessária.`, {
  //     description: `Você deseja mesmo deletar o produto ${product.name}?`,
  //     id: "delete-product-confirm",
  //     action: {
  //       label: "Confirmar deleção!",
  //       onClick() {
  //         toast.info(`Deletando produto ${product.name}...`, {
  //           id: "delete-product",
  //         });

  //         deleteProductMutation.mutate(product);
  //       },
  //     },
  //   });
  // };

  const handleSaveProduct = (product: Partial<EditProductType>) => {
    toast.info(`Atualizando as informações do produto...`, {
      id: "update-challenge",
    });

    updateProductMutation.mutate(product);
  };

  const handleEdit = (product: ProductType) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  if (!data || data.length == 0) {
    return (
      <div className="text-center py-8">
        <Box className="h-12 w-12 mx-auto mb-4" />
        <p>Nenhum produto criado ainda</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="bg-card shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Categoria</TableHead>
            <TableHead className="font-semibold">Visível?</TableHead>
            <TableHead className="font-semibold">Rubys</TableHead>
            <TableHead className="font-semibold">Max. compras</TableHead>
            <TableHead className="font-semibold w-32 text-center">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product: ProductType, index: number) => {
            return (
              <TableRow key={index}>
                <TableCell>{product.name ?? "Desconhecido"}</TableCell>

                <TableCell>
                  <span>
                    {product.category ?? "Desconhecido"}
                  </span>
                </TableCell>

                <TableCell>
                  <span>
                    {product.hidden == true ? "Não" : "Sim"}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-ctf-red"
                  >
                    <Gem className="h-3 w-3 mr-1" />
                    {product.price?.toLocaleString() || 0}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span>
                    {product.max_purchases
                      ? `${product.max_purchases} por usuário`
                      : "Desconhecido"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4 text-ctf-blue" />
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <EditProductForms
        product={editingProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
