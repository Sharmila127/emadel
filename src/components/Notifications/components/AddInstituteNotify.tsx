/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS, FONTS } from "@/constants/ui constants";
import { ChevronDownIcon, Plus } from "lucide-react";
import close from "../../../assets/close.png";
import {
  CreatNotificationThunks,
  GetAllBranchThunks,
  GetAllInstituteThunks,
} from "@/features/notification/redux/thunks";
import type { RootState } from "@/store";

type props = {
  setFormModalOpen: (show: boolean) => void;
  formModalOpen: boolean;
};

const AddInstituteNotify: React.FC<props> = ({
  formModalOpen,
  setFormModalOpen,
}) => {
  const dispatch = useDispatch();


  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const institutes = useSelector((state: any) => state?.Institute?.institute);

  useEffect(() => {
    dispatch(GetAllInstituteThunks() as any);
  }, [dispatch]);



  const branches = useSelector((state: RootState) => state?.Branch?.branch);

  useEffect(() => {
    if (selectedInstitute) {
      dispatch(GetAllBranchThunks({ institute: selectedInstitute }) as any);
      setSelectedBranch("");
    } else {
      setSelectedBranch("");
    }
  }, [dispatch, selectedInstitute]);

  const handleSubmit = () => {
    if (!selectedInstitute || !selectedBranch || !title || !body) {
      alert("Please fill all required fields");
      return;
    }

    const dataToSend = {
      institute_id: selectedInstitute,
      branches: [selectedBranch],
      title,
      body,
      link,
    };

    dispatch(CreatNotificationThunks(dataToSend) as any)
      .then(() => {
        setFormModalOpen(false);

        setTitle("");
        setBody("");
        setLink("");
        setSelectedInstitute("");
        setSelectedBranch("");
      })
      .catch(() => alert("Failed to create notification"));
  };

  return (
    <>
      {formModalOpen && (
        <div className="h-full w-[350px] bg-white grid gap-7 shadow-md p-5 rounded-lg">
          <div className="flex justify-between items-center">
            <h1 style={{ ...FONTS.profile_head }}>Add Notification</h1>
            <button onClick={() => setFormModalOpen(false)}>
              <img className="w-[24px] h-[24px]" src={close} alt="Close" />
            </button>
          </div>
          <div>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="grid gap-2">
                <label style={{ ...FONTS.text4 }}>Institute List</label>
                <Select
                  value={selectedInstitute}
                  onValueChange={(value) => setSelectedInstitute(value)}
                >
                  <SelectTrigger className="w-full border rounded-[8px] border-[#716F6F] pr-[16px] pl-[16px]">
                    <SelectValue placeholder="Select Institute" />
                    <ChevronDownIcon className="size-4 opacity-50 text-[#716F6F]" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FFFFFF]">
                    {(institutes || [])
                      .filter((item: any) => item?.institute_name)
                      .map((item: any) => (
                        <SelectItem
                          key={item.uuid}
                          value={item.uuid}
                          style={{ ...FONTS.text4 }}
                          className={`hover:bg-[${COLORS.primary}] text-gray-700 focus:bg-[${COLORS.primary}] p-2 my-1.5 focus:text-white rounded-[8px] cursor-pointer`}
                        >
                          {item.institute_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label style={{ ...FONTS.text4 }}>Branch List</label>
                <Select
                  value={selectedBranch}
                  onValueChange={(value) => setSelectedBranch(value)}
                  disabled={!selectedInstitute}
                >
                  <SelectTrigger
                    className={`w-full border rounded-[8px] border-[#716F6F] pr-[16px] pl-[16px]`}
                  >
                    <SelectValue placeholder="Select Branch" />
                    <ChevronDownIcon className="size-4 opacity-50 text-[#716F6F]" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {(branches || [])
                      .filter((item: any) => item?.branch_identity)
                      .map((item: any) => (
                        <SelectItem
                          key={item.uuid}
                          value={item.uuid}
                          style={{ ...FONTS.text4 }}
                          className={`hover:bg-[${COLORS.primary}] text-gray-700 focus:bg-[${COLORS.primary}] p-2 my-1.5 focus:text-white rounded-[8px] cursor-pointer`}
                        >
                          {item.branch_identity}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label style={{ ...FONTS.text4 }}>Title</label>
                <Input
                  className="border border-t-black border-b-gray-300 border-l-gray-300 border-r-gray-300 h-10"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label style={{ ...FONTS.text4 }}>Body</label>
                <Input
                  className="border border-t-black border-b-gray-300 border-l-gray-300 border-r-gray-300 h-20"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label style={{ ...FONTS.text4 }}>Link</label>
                <Input
                  className="border border-t-black border-b-gray-300 border-l-gray-300 border-r-gray-300 h-10"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div className="flex justify-between gap-2 mt-5">
                <Button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="text-[#68B39F] border border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-2 py-5"
                >
                  <span style={{ ...FONTS.button_text }}>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-[#68B39F] text-white border-[#68B39F] hover:bg-[#2D6974] rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none px-2 py-5"
                >
                  <Plus className="w-6 h-6" />
                  <span style={{ ...FONTS.button_text }}>Add</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddInstituteNotify;
