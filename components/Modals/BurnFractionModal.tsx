import { useState } from "react";
import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useFractionById } from "../../hooks/fractions";
import { useHypercertInfo } from "../../hooks/useHypercert";
import { useBurnFraction } from "../../hooks/burn";
import { burnFractionModal } from "../../content/burn-hypercert-content";
import { formatFractionPercentage } from "../../utils/formatting";
import { useRouter } from "next/router";

type C = (args: { onClick: () => void }) => JSX.Element;

export const BurnFractionModal = ({
  render,
  tokenId,
  hypercertId,
}: {
  render: C;
  tokenId: string;
  hypercertId: string;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { push } = useRouter();

  const { data: hypercertInfo, loading: loadingHypercertInfo } =
    useHypercertInfo(hypercertId);

  const [step, setStep] = useState<"confirm" | "burning" | "complete">(
    "confirm"
  );

  const { data, loading } = useFractionById(tokenId);
  const split = useBurnFraction({
    onComplete: async () => {
      setStep("complete");
      await push({ pathname: "/my-hypercerts", query: { withPolling: true } });
    },
    onError: () => {
      setStep("confirm");
    },
  });

  if (
    loading ||
    loadingHypercertInfo ||
    !data?.hypercertFraction ||
    !hypercertInfo
  )
    return null;

  const close = () => {
    setStep("confirm");
    onClose();
  };

  const onClickBurn = async () => {
    setStep("burning");
    await split(tokenId);
  };

  return (
    <>
      {render({ onClick: onOpen })}
      <Modal isOpen={isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          {step === "confirm" && (
            <>
              <ModalHeader>{burnFractionModal.confirm.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb={4}>
                  {burnFractionModal.confirm.body(
                    data.hypercertFraction.units,
                    formatFractionPercentage(
                      data.hypercertFraction.units,
                      data.hypercertFraction.hypercert.totalUnits
                    )
                  )}
                  {" '"}
                  <b>{hypercertInfo.name}</b>
                  {"'."}
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" onClick={close}>
                  {burnFractionModal.confirm.closeButton}
                </Button>
                <Button colorScheme="red" mr={3} onClick={onClickBurn}>
                  {burnFractionModal.confirm.confirmButton}
                </Button>
              </ModalFooter>
            </>
          )}
          {step === "burning" && (
            <>
              <ModalHeader>{burnFractionModal.confirm.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Center my={6}>
                  <Spinner />
                </Center>
              </ModalBody>
            </>
          )}
          {step === "complete" && (
            <>
              <ModalHeader>{burnFractionModal.confirm.title}</ModalHeader>
              <ModalCloseButton />
              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={onClose}>
                  {burnFractionModal.complete.confirmButton}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
