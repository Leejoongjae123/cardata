"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {createClient} from "@/utils/supabase/client";

function RequestEst({title, description, thumbImage, productId, id, userId}) {
  const { isOpen:isOpen1, onOpen:onOpen1, onOpenChange:onOpenChange1 } = useDisclosure();
  const { isOpen:isOpen2, onOpen:onOpen2, onOpenChange:onOpenChange2 } = useDisclosure();
  const supabase = createClient();

  const handleRequestEst = async () => {

    const { data: carData, error: carError } = await supabase
      .from("cardata")
      .update({ isRequest: true })
      .eq("id", id);

    if (carError) {
      console.error("Error updating car data:", carError);
      return;
    }
    

    const { data: existingData, error: existingError } = await supabase
      .from("requests")
      .select("*")
      .eq("productId", id)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      console.error(existingError);
      onOpen2();
      return;
    }

    if (!existingData) {
      const { data, error } = await supabase.from("requests").insert([
        {
          productId: id,
          userId: userId,
          encarId: productId,
          thumbImage: thumbImage,
          title: title,
          description: description,
        },
      ]);
      if (error) {
        console.error(error);
      } else {
        console.log(data);
      }
      onOpen1();
    } else {
      console.log("Request with this productId already exists.");
      onOpen2();
    }
  };

  return (
    <>
      {/* <button
        className="button bg-primary px-3 text-white w-full"
        uk-tooltip="title: Ask; offset: 8"      
        onPress={onOpen}
        >
        견적 요청하기
      </button> */}
      <Button
        className="button bg-primary px-3 text-white w-full"
        uk-tooltip="title: Ask; offset: 8"
        onPress={() => {
          handleRequestEst();
        }}
        size='sm'
      >
        견적 신청하기
      </Button>

      <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                견적 신청완료
              </ModalHeader>
              <ModalBody>
                <p className="text-lg font-semibold">
                  견적 신청이 완료되었습니다.
                </p>
                <p className="text-medium ">
                담당자가 빠른 시일 내에 파악하여 가입하신 메일 주소로 회신 드리겠습니다.
                </p>
                
              </ModalBody>
              <ModalFooter>
                <Button className="text-white" color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen2} onOpenChange={onOpenChange2}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                견적 신청완료
              </ModalHeader>
              <ModalBody>
                <p className="text-lg font-semibold">
                  이미 견적신청을 완료하였습니다.
                </p>
                <p className="text-medium ">
                담당자가 빠른 시일 내에 파악하여 가입하신 메일 주소로 회신 드리겠습니다.
                </p>
                
              </ModalBody>
              <ModalFooter>
                <Button className="text-white" color="primary" onPress={onClose}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default RequestEst;
