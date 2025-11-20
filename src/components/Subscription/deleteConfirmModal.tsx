import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import warningIcon from "../../assets/warning icon.png"
import tickicon from "../../assets/succesfull tick.png"
import { useState } from "react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [statusChanged, setStatusChanged] = useState(false);

  const handleConfirm = () => {
    setStatusChanged(true);
    setTimeout(() => {
      onConfirm();
      onClose();
      setStatusChanged(false);
    }, 1500); 
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center rounded-2xl">
        {!statusChanged ? (
          <>
            <DialogHeader>
              <img src={warningIcon} alt="Warning" className="w-20 h-20 mx-auto" />
              <DialogTitle className="mt-3 text-lg text-center font-bold">Are You Sure?</DialogTitle>
              <p className="text-gray-500 text-center text-sm">Are you sure you want to delete this plan?!</p>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <div className="flex gap-75">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-tl-xl rounded-br-xl border-[#68b39f] text-[#68b39f] hover:bg-[#eaf5f2]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-[#68b39f] text-white rounded-tl-xl rounded-br-xl hover:bg-[#57a38e]"
              >
                Change
              </Button>
                </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <img src={tickicon} alt="Success" className="w-14 mx-auto" />
            <DialogTitle className="mt-3 text-lg font-bold">Status Changed</DialogTitle>
            <DialogFooter className="flex justify-center mt-4">
              <Button
                onClick={onClose}
                className="bg-[#68b39f] text-white text-center rounded-tl-xl rounded-br-xl hover:bg-[#57a38e]"
              >
                Ok
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
