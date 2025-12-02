"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { toUseExamProduct } from "@/utils/api/exam";
import { getOwnedItems } from "@/utils/api/store";
import {
  AlternativesExerciseType,
  ExamType,
  ExerciseType,
  productsToUseOnExam,
} from "@/utils/types/exam";
import {
  getExamsAvailableInventory,
  InventoryList,
  ProductActions,
  ProductActionsStyles,
  ProductType,
} from "@/utils/types/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Frown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Trocar questão
// Adicionar 10 min
// Dica de um exercício
// Remover metade das alternativas

export default function ProductsSideCard({
  exam,
  currentExercise,
}: {
  exam: ExamType;
  currentExercise: ExerciseType;
}) {
  const queryClient = useQueryClient();
  // const status = getExamStatus(exam);
  const availableInventoryRef = useRef<HTMLButtonElement>(null);
  const [availableProducts, setAvailableProducts] = useState<ProductType[]>([]);
  const [confirmingProduct, setConfirmingProduct] =
    useState<ProductType | null>(null);

  const { data: inventory } = useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<InventoryList> =>
      await getOwnedItems().then((data) => {
        return data.data;
      }),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const { mutate: toUseExamProductMutation, isPending: usingProduct } =
    useMutation({
      mutationKey: ["completed-exam", exam.id],
      mutationFn: async ({ product }: { product: ProductType }) => {
        let exerciseIdToUse = currentExercise.id;
        const actionsBySubstitute = [
          ProductActions.RemoveExamAlternatives,
          ProductActions.ExamHint,
        ];

        if (
          actionsBySubstitute.includes(product.action) &&
          currentExercise.substitute_question
        ) {
          exerciseIdToUse = currentExercise.substitute_question.id;
        }

        return toUseExamProduct({
          exam,
          product,
          exerciseId: exerciseIdToUse,
        });
      },
      onSuccess: (response) => {
        if (!response) return;

        if (response.success) {
          toast.success(response.message);

          availableInventoryRef.current!.click();

          // queryClient.setQueryData(
          //   ["completed-exam", exam.id],
          //   (oldExam?: ExamType) => {
          //     if (!oldExam) return oldExam;
          //     const usedProduct = response.data;

          //     const oldQuestionUsedProducts = oldExam.exercises[
          //       currentExercise.exercise_number - 1
          //     ].substitute_question
          //       ? oldExam.exercises[currentExercise.exercise_number - 1]
          //           .substitute_question?.used_products
          //       : oldExam.exercises[currentExercise.exercise_number - 1]
          //           .used_products;

          //     const oldExamUsedProducts = oldExam.used_products_exam;

          //     let newExamUsedProducts;

          //     if (productsToUseOnExam.includes(usedProduct.action)) {
          //       // oldExam.used_products_exam = oldExamUsedProducts
          //       newExamUsedProducts = oldExamUsedProducts
          //         ? oldExamUsedProducts.map((oldUsedProduct) => {
          //             return oldUsedProduct.id === usedProduct.id
          //               ? {
          //                   ...oldUsedProduct,
          //                   quantity:
          //                     oldUsedProduct.quantity + usedProduct.quantity,
          //                 }
          //               : oldUsedProduct;
          //           })
          //         : [usedProduct];
          //     } else {
          //       switch (usedProduct.action) {
          //         case ProductActions.RemoveExamAlternatives:
          //           if (
          //             oldExam.exercises[currentExercise.exercise_number - 1]
          //               .substitute_question
          //           ) {
          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].substitute_question!.removed_alternatives =
          //               usedProduct.response as AlternativesExerciseType[];

          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].substitute_question!.used_products =
          //               oldQuestionUsedProducts
          //                 ? oldQuestionUsedProducts.map((oldUsedProduct) => {
          //                     return oldUsedProduct.id === usedProduct.id
          //                       ? {
          //                           ...oldUsedProduct,
          //                           quantity:
          //                             oldUsedProduct.quantity +
          //                             usedProduct.quantity,
          //                           response: response.message,
          //                         }
          //                       : oldUsedProduct;
          //                   })
          //                 : [usedProduct];
          //           } else {
          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].removed_alternatives =
          //               usedProduct.response as AlternativesExerciseType[];

          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].used_products = oldQuestionUsedProducts
          //               ? oldQuestionUsedProducts.map((oldUsedProduct) => {
          //                   return oldUsedProduct.id === usedProduct.id
          //                     ? {
          //                         ...oldUsedProduct,
          //                         quantity:
          //                           oldUsedProduct.quantity +
          //                           usedProduct.quantity,
          //                         response: response.message,
          //                       }
          //                     : oldUsedProduct;
          //                 })
          //               : [usedProduct];
          //           }
          //           break;
          //         case ProductActions.SwapExamQuestion:
          //           oldExam.exercises[currentExercise.exercise_number - 1] = {
          //             ...oldExam.exercises[currentExercise.exercise_number - 1],
          //             substitute_question: {
          //               ...(usedProduct.response as ExerciseType),
          //             },
          //           }; // pass new question to current question
          //           break;
          //         default:
          //           if (
          //             oldExam.exercises[currentExercise.exercise_number - 1]
          //               .substitute_question
          //           ) {
          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].substitute_question!.used_products =
          //               oldQuestionUsedProducts
          //                 ? oldQuestionUsedProducts.map((oldUsedProduct) => {
          //                     return oldUsedProduct.id === usedProduct.id
          //                       ? {
          //                           ...oldUsedProduct,
          //                           quantity:
          //                             oldUsedProduct.quantity +
          //                             usedProduct.quantity,
          //                         }
          //                       : oldUsedProduct;
          //                   })
          //                 : [usedProduct];
          //           } else {
          //             oldExam.exercises[
          //               currentExercise.exercise_number - 1
          //             ].used_products = oldQuestionUsedProducts
          //               ? oldQuestionUsedProducts.map((oldUsedProduct) => {
          //                   return oldUsedProduct.id === usedProduct.id
          //                     ? {
          //                         ...oldUsedProduct,
          //                         quantity:
          //                           oldUsedProduct.quantity +
          //                           usedProduct.quantity,
          //                       }
          //                     : oldUsedProduct;
          //                 })
          //               : [usedProduct];
          //           }
          //           break;
          //       }
          //     }

          //     return {
          //       ...{ ...oldExam },
          //       used_products_exam: newExamUsedProducts,
          //     };
          //   }
          // );
        
          queryClient.setQueryData(["completed-exam", exam.id], (oldExam?: ExamType) => {
            if (!oldExam) return oldExam;
            const actionsBySubstitute = [
              ProductActions.RemoveExamAlternatives,
              ProductActions.ExamHint,
            ];
          
            const usedProduct = response.data;
          
            // clone exercises array
            const exercises = oldExam.exercises.slice();
          
            // find index by exercise_number OR by id (mais seguro)
            const idx = exercises.findIndex(
              (e) => e.exercise_number === currentExercise.exercise_number || e.id === currentExercise.id
            );
            if (idx === -1) return oldExam;
          
            // clone the specific exercise object (não mutate in-place)
            const exercise = { ...exercises[idx] };
          
            // helper para obter/atualizar used_products do lugar correto
            const targetIsSubstitute =
              actionsBySubstitute.includes(usedProduct.action) && exercise.substitute_question;
          
            if (usedProduct.action === ProductActions.SwapExamQuestion) {
              // Exemplo: substitui a substitute_question
              exercise.substitute_question = {
                ...(usedProduct.response as ExerciseType),
              };
            } else if (usedProduct.action === ProductActions.RemoveExamAlternatives) {
              if (targetIsSubstitute) {
                const substitute = { ...(exercise.substitute_question!) };
                substitute.removed_alternatives = usedProduct.response as AlternativesExerciseType[];
                substitute.used_products = substitute.used_products
                  ? substitute.used_products.map((p) =>
                      p.id === usedProduct.id ? { ...p, quantity: p.quantity + usedProduct.quantity, response: response.message } : p
                    )
                  : [{ ...usedProduct, response: response.message }];
                exercise.substitute_question = substitute;
              } else {
                exercise.removed_alternatives = usedProduct.response as AlternativesExerciseType[];
                exercise.used_products = exercise.used_products
                  ? exercise.used_products.map((p) =>
                      p.id === usedProduct.id ? { ...p, quantity: p.quantity + usedProduct.quantity, response: response.message } : p
                    )
                  : [{ ...usedProduct, response: response.message }];
              }
            } else {
              // default: add/update used_products
              if (targetIsSubstitute) {
                const substitute = { ...(exercise.substitute_question!) };
                substitute.used_products = substitute.used_products
                  ? substitute.used_products.map((p) =>
                      p.id === usedProduct.id ? { ...p, quantity: p.quantity + usedProduct.quantity } : p
                    )
                  : [{ ...usedProduct }];
                exercise.substitute_question = substitute;
              } else {
                exercise.used_products = exercise.used_products
                  ? exercise.used_products.map((p) =>
                      p.id === usedProduct.id ? { ...p, quantity: p.quantity + usedProduct.quantity } : p
                    )
                  : [{ ...usedProduct }];
              }
            }
          
            // put back the updated exercise into cloned array
            exercises[idx] = exercise;
          
            // update exam-level used_products_exam de forma imutável
            const oldExamUsedProducts = oldExam.used_products_exam ?? [];
            let newExamUsedProducts = oldExamUsedProducts;
          
            if (productsToUseOnExam.includes(usedProduct.action)) {
              const exists = oldExamUsedProducts.find((p) => p.id === usedProduct.id);
              if (exists) {
                newExamUsedProducts = oldExamUsedProducts.map((p) =>
                  p.id === usedProduct.id ? { ...p, quantity: p.quantity + usedProduct.quantity } : p
                );
              } else {
                newExamUsedProducts = [...oldExamUsedProducts, usedProduct];
              }
            }
          
            // return a new exam object with new exercises array and new used_products_exam
            return {
              ...oldExam,
              exercises,
              used_products_exam: newExamUsedProducts,
            };
          });
          
        } else {
          toast.warning(response.message);
        }
      },
      onError: (error) => {
        toast.error("Ocorreu algum erro ao tentar usar o produto", {
          description: error.message,
        });
      },
    });

  useEffect(() => {
    if (exam && inventory) {
      const usableProducts = getExamsAvailableInventory(exam, inventory);
      setAvailableProducts(usableProducts);
    }
  }, [exam, inventory]);

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Produtos</CardTitle>
        <CardDescription className="text-sm">
          Visualize os produtos que podem ser usados no exame / questão atual!
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Drawer>
          <DrawerTrigger
            ref={availableInventoryRef}
            className={cn(
              "outline-none cursor-pointer",
              !availableProducts ||
                (availableProducts.length <= 0 && "opacity-80")
            )}
            disabled={!availableProducts || availableProducts.length <= 0}
          >
            <div className="flex flex-col items-start text-start gap-3 text-sm">
              <h2>
                {availableProducts && availableProducts.length > 0
                  ? "Visualizar items disponíveis para esse exame / questão."
                  : "Você não possui produtos disponíveis para esse exame."}
              </h2>

              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 transition-all *:data-[slot=avatar]:ring-2 cursor-pointer w-full">
                {availableProducts.length > 0 ? (
                  availableProducts.map((product) => {
                    const actionStyle = ProductActionsStyles[product.action];
                    const ActionIcon = actionStyle.icon;
                    const ActionColor = actionStyle.color;

                    return (
                      <Avatar key={product.id}>
                        <AvatarImage src="#" alt="" />
                        <AvatarFallback className={`${ActionColor} text-white`}>
                          <ActionIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    );
                  })
                ) : (
                  <div className="grow flex flex-col gap-2 justify-center opacity-70">
                    <Avatar>
                      <AvatarImage src="#" alt="" />
                      <AvatarFallback>
                        <Frown />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Produtos disponíveis para utilizar</DrawerTitle>
              <DrawerDescription>
                Baseado no seu inventário e no exame que você esta realizando,
                você pode utilizar os produtos abaixo.
              </DrawerDescription>
            </DrawerHeader>

            <div className="flex flex-wrap py-6 px-4 pb-10 gap-4 w-full max-w-6xl mx-auto">
              {availableProducts.length > 0 ? (
                availableProducts.map((product) => {
                  // const categoryStyle =
                  //   ProductCategoriesStyles[
                  //     product.category as ProductCategories
                  //   ];

                  const actionStyle = ProductActionsStyles[product.action];
                  // const CategoryIcon = categoryStyle.icon;
                  const ActionIcon = actionStyle.icon;
                  const ActionColor = actionStyle.color;

                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "flex items-start gap-4 rounded-xl border p-4 shadow-sm grow hover:shadow-lg transition-all cursor-pointer",
                        usingProduct && "opacity-70 cursor-default"
                      )}
                      // toUseExamProductMutation({ product })
                      // onClick={() => TempHandle({product})}
                      onClick={() => setConfirmingProduct(product)}
                      // disabled={usingProduct}
                    >
                      <div
                        className={`rounded-md p-2 text-white ${ActionColor}`}
                      >
                        <ActionIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 grow flex items-center gap-4 flex-wrap">
                        <div className="grow flex flex-col items-start">
                          <h4 className="font-semibold leading-none">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </div>
                        <div>
                          {confirmingProduct &&
                            confirmingProduct.id === product.id && (
                              <div className="flex gap-2 w-full justify-end">
                                <Button
                                  size="sm"
                                  variant={"outline"}
                                  type="reset"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    setConfirmingProduct(null);
                                  }}
                                >
                                  Cancelar
                                </Button>

                                <Button
                                  size="sm"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    toUseExamProductMutation({ product });
                                    setConfirmingProduct(null);
                                  }}
                                >
                                  Confirmar
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="grow flex flex-col gap-2 items-center justify-center opacity-70">
                  <Frown size={50} className="" />
                  <h3 className="max-w-90 text-center">
                    Você não tem nenhum produto disponível para ser utilizado
                    nesse exame.
                  </h3>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}
