/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import editIcon from "../../../assets/EditIcon.svg";
import deleteIcon from "../../../assets/Mask group (2).svg";
import { MdCancel } from "react-icons/md";
import warning from "../../../assets/warning.svg";
import { useDispatch, useSelector } from "react-redux";
import { getAllFaq } from "@/features/Faq/selector";
import { fetchFAQsThunk } from "@/features/Faq/thunks";
import { createFAQ, deleteFAQ, updateFAQ } from "@/features/Faq/service";
import { getCategoriesThunks } from "@/features/FaqCategories/reducers/thunks";
import { FONTS } from "@/constants/ui constants";

const FAQ = () => {

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages,] = useState(3);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    faqId: null,
  });
  const [statusConfirm, setStatusConfirm] = useState({
    isOpen: false,
    faqId: null,
  });
  const [statusContent, setStatusContent] = useState({
    content: "",
    header: "",
  });
  const [statusSuccess, setStatusSuccess] = useState(false);

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    categoryId: "",
    categoryName: "",
    status: true,
  });

  const dispatch = useDispatch<any>();
  const AllFaqs = useSelector(getAllFaq);
  console.log("faqs", AllFaqs);

  console.log("pages", AllFaqs.length)


  const mappedFaqs = AllFaqs.map((faq: any) => ({
    id: faq._id,
    uuid: faq.uuid,
    question: faq.identity,
    description: faq.description,
    category: faq.category?.identity || "",
    categoryId: faq.category?.uuid || "",
    status: faq.is_active,
  }));

  const filteredFaqs = mappedFaqs.filter(
    (faq: any) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // show skeleton
      await dispatch(fetchFAQsThunk({ page }));
      setLoading(false);
    };
    fetchData();
  }, [dispatch, page]);

  const categoriess = useSelector((state: any) => state.CategoriesSlice.data);

  useEffect(() => {
    dispatch(getCategoriesThunks({ page: 1 }));
  }, [dispatch]);

  console.log("category", categoriess);

  const handleStatusToggle = (id: any) => {
    setStatusConfirm({ isOpen: true, faqId: id });
  };

  const confirmStatusChange = async () => {
    if (!statusConfirm.faqId) return;

    try {

      const currentFaq = mappedFaqs.find((faq: any) => faq.id === statusConfirm.faqId);
      if (!currentFaq) return;

      const payload = {
        is_active: !currentFaq.status,
        id: currentFaq.uuid,
      };

      console.log("Status update payload:", payload);


      const res = await updateFAQ(payload);
      console.log("Status update response:", res.data);

      dispatch(fetchFAQsThunk({ page: 3 }));

      setStatusConfirm({ isOpen: false, faqId: null });
      setStatusContent({ content: "Status Changed", header: "updated" });
      setStatusSuccess(true);
    } catch (error) {
      console.error("Error updating FAQ status:", error);
      setStatusConfirm({ isOpen: false, faqId: null });
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        identity: formData.question,
        description: formData.description,
        category: formData.categoryId,
      };

      const res = await createFAQ(payload);
      console.log("Create FAQ response:", res.data);

      dispatch(fetchFAQsThunk({ page: 3 }));
      setIsAddOpen(false);
      setFormData({
        question: "",
        description: "",
        categoryId: "",
        categoryName: "",
        status: true,
      });
    } catch (err) {
      console.error("Error creating FAQ:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        id: editFaq.uuid,
        identity: formData.question,
        description: formData.description,
      };

      console.log("payload", payload);

      const res = await updateFAQ(payload);
      console.log("Update FAQ response:", res.data);

      dispatch(fetchFAQsThunk({ page: 3 }));
      setIsEditOpen(false);
      setEditFaq(null);
      setFormData({
        question: "",
        description: "",
        categoryId: "",
        categoryName: "",
        status: true,
      });
    } catch (err) {
      console.error("Error updating FAQ:", err);
    }
  };


  const handleDeleteClick = (id: any) => {
    setDeleteConfirm({ isOpen: true, faqId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.faqId) return;

    try {
      await deleteFAQ({ id: deleteConfirm.faqId });

      setDeleteConfirm({ isOpen: false, faqId: null });
      setStatusContent({ content: "Deleted", header: "deleted" });
      setStatusSuccess(true);

      dispatch(fetchFAQsThunk({ page: 3 }));
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  const SkeletonHeader = () => (
    <thead className="animate-pulse w-full h-16 rounded-xl">
      <tr>
        <th className="px-6 py-3 rounded-l-xl">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
        </th>
        <th className="px-6 py-3">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
        </th>
        <th className="px-6 py-3">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
        </th>
        <th className="px-6 py-3 rounded-r-xl text-right">
          <div className="h-6 w-32 bg-gray-300 rounded ml-auto"></div>
        </th>
      </tr>
    </thead>
  );

  const SkeletonRow = () => (

    <tr className="animate-pulse bg-white/30 backdrop-blur-xl h-30 rounded-xl">
      <td className="px-6 py-4">
        <div className="h-4 w-40 bg-gray-300 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 w-12 bg-gray-300 rounded-full"></div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end space-x-3">
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-5 min-h-screen relative">
      <div className="flex mt-5 items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border border-[#999999] rounded-lg px-3 py-2 w-92"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setIsAddOpen(true)}
          className="ml-auto flex bg-[#68B39F] text-[#FFFFFF] px-4 py-2 rounded-tl-xl rounded-br-xl rounded "
        >
          <IoMdAdd className="mt-1 mr-2" /> Add FAQ
        </button>
      </div>


      <table className="min-w-full text-[#999999] text-sm border-separate border-spacing-y-4">
        {loading ? (
          <>
            <SkeletonHeader />
          </>
        ) : (
          <>
            <thead className="bg-[#2D6974] text-white  text-left text-lg font-semibold"
              style={{ ...FONTS.tableheader }}>
              <tr>
                <th className="px-6 py-3 rounded-l-xl">Faq Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead></>)}
        <tbody>

          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            <>
              {filteredFaqs.map((faq: any) => (
                <tr
                  key={faq.id}
                  className="bg-white/30 backdrop-blur-xl text-base shadow-lg  rounded-xl font-medium transition"
                  style={{ ...FONTS.description }}
                >
                  <td className="px-6 py-4 rounded-l-xl">{faq.question}</td>
                  <td className="px-6 py-4">{faq.category}</td>

                  <td className="px-6 py-4">
                    <label className="inline-flex items-center cursor-pointer">

                      <input
                        type="checkbox"
                        checked={faq.status}
                        onChange={() => handleStatusToggle(faq.id)}
                        className="sr-only peer"
                      />

                      <div
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${faq.status ? "bg-green-500" : "bg-gray-300"
                          }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${faq.status ? "translate-x-3" : "translate-x-0"
                            }`}
                        ></span>
                      </div>
                    </label>
                  </td>
                  <td className="px-6 py-4 rounded-r-xl">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setEditFaq(faq);
                          setFormData({
                            question: faq.question,
                            description: faq.description,
                            categoryId: faq.categoryId,
                            categoryName: faq.category,
                            status: faq.status,
                          });

                          setIsEditOpen(true);
                        }}
                      >
                        <img src={editIcon} alt="Edit" />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteClick(faq.uuid)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </>)}
          {filteredFaqs.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4 text-gray-500">
                No FAQs found
              </td>
            </tr>
          )}
        </tbody>
      </table>


      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 rounded-tl-xl rounded-br-xl py-2 rounded ${page === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#68B39F] text-white"
            }`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 rounded-tl-xl rounded-br-xl py-2 rounded ${page === i + 1
              ? "bg-[#2D6974] text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 rounded-tl-xl rounded-br-xl py-2 rounded ${page === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#68B39F] text-white"
            }`}
        >
          Next
        </button>
      </div>


      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white overflow-y-auto p-6 rounded-xl w-[28%] h-[80%]">
            <div className="flex">
              <h2 className="text-xl font-bold mb-4">Add FAQ</h2>
              <div
                className="ml-auto cursor-pointer"
                onClick={() => setIsAddOpen(false)}
              >
                <MdCancel className="text-2xl" />
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-5">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="border rounded-lg border-gray-300 px-3 py-2 w-full mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mt-3">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border rounded-lg border-gray-300 px-3 py-2 w-full mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mt-3">
              Category
            </label>
            <div className="relative">
              <div
                className="border border-gray-300 rounded-lg px-3 py-2 w-full cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span>{formData.categoryName || "Select a category"}</span>
                <IoIosArrowDown
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
              </div>


              {isOpen && (
                <div
                  className="absolute w-full bg-white shadow-xl mt-1 rounded-lg border overflow-x-auto border-gray-300 z-10 space-y-2 p-2 
                  max-h-48 overflow-y-auto"
                >
                  {categoriess?.map((cat: any) => (
                    <div
                      key={cat.uuid}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: cat.uuid,
                          categoryName: cat.identity,
                        }));
                        setIsOpen(false);
                      }}
                      className={`px-3 py-2 border rounded-tl-xl rounded-br-xl border-gray-200 cursor-pointer 
          hover:bg-[#68B39F] hover:text-white ${formData.categoryId === cat.uuid ? "bg-[#68B39F] text-white" : ""
                        }`}
                    >
                      {cat.identity}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex mt-50 justify-between">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 h-10 rounded rounded-tl-xl rounded-br-xl border-[#68B39F] text-[#68B39F] border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 h-10 rounded ml-auto rounded-tl-xl rounded-br-xl bg-[#68B39F] text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}



      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white overflow-y-auto p-6 rounded-xl w-2/3 h-[60%] grid gap-5">
            <div className="flex">
              <h2 className="text-xl font-bold mb-4">Edit FAQ</h2>
              <div className="ml-auto " onClick={() => setIsEditOpen(false)}>
                <MdCancel className="text-2xl" />
              </div>
            </div>

            <label className="block text-md font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="border rounded-lg border-gray-300 px-3 py-2 w-full mb-3"
            />

            <label className="block text-md font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="border rounded-lg border-gray-300 px-3 py-2 w-full mb-3"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 h-10 text-[#68B39F] rounded-tl-xl rounded-br-xl border-[#68B39F] rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 h-10 rounded rounded-tl-xl rounded-br-xl bg-[#68B39F] text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 text-center">
            <div className="mb-6">
              <div className="mx-auto w-26 h-26 rounded-full flex items-center justify-center mb-4">
                <img src={warning} alt="" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Are You Sure?
              </h2>
              <p className="text-gray-600">
                Are you sure you want to Delete this item?
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, faqId: null })}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {statusConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 text-center">
            <div className="mb-6">
              <div className="mx-auto w-26 h-26 rounded-full flex items-center justify-center mb-4">
                <img src={warning} alt="" />
              </div>

              <p className="text-gray-600">
                Are you sure you want to change the status?
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStatusConfirm({ isOpen: false, faqId: null })}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-6 py-2 bg-[#68B39F] text-white rounded-lg hover:bg-[#5a9d8a] transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {statusSuccess && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16  bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width={32}
                  height={32}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {statusContent.content}
              </h2>
              <p className="text-gray-600">
                The item has been {statusContent.header} successfully.
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStatusSuccess(false)}
                className="px-8 py-2 bg-[#68B39F] text-white rounded-lg hover:bg-[#5a9d8a] transition-colors"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;