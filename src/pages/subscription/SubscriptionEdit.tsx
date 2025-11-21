import { EditSubscription } from "@/features/subscription/services";
import { useState, useEffect, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AxiosResponse } from "axios";

const SubscriptionEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const incomingPlan = location.state?.plan;

    const [formData, setFormData] = useState<any>({
        name: "",
        description: "",
        price: "",
        duration: "",
        durationType: "Days",
        supportLevel: "",
        features: [],
        unlimited: {
            Students: "",
            Admins: "",
            Teachers: "",
            Batches: "",
            Courses: "",
            Classes: "",
        },
        image: null,
        imagePreview: null,
    });

    useEffect(() => {
        if (incomingPlan) {
            const mappedFeatures = incomingPlan.features.map((item: any) => ({
                featureName: item.feature?.identity || item.feature?.name,
                count: item?.count,
                unlimited: item?.count === "Unlimited",
            }));

            const initialUnlimited: any = {};
            mappedFeatures.forEach((feature: any) => {
                initialUnlimited[feature.featureName] = feature.unlimited;
            });

            setFormData({
                ...incomingPlan,
                features: mappedFeatures,
                unlimited: initialUnlimited,
                imagePreview: incomingPlan.image,
            });
        }
    }, [incomingPlan]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, key: string) => {
        const value = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFeatureChange = (e: ChangeEvent<HTMLInputElement>, label: string) => {
        const value = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            features: prev.features.map((f: any) =>
                f.featureName === label ? { ...f, count: value, unlimited: false } : f
            ),
            unlimited: { ...prev.unlimited, [label]: false },
        }));
    };

    const handleUnlimitedChange = (label: string) => {
        setFormData((prev: any) => ({
            ...prev,
            unlimited: {
                ...prev.unlimited,
                [label]: !prev.unlimited[label],
            },
            features: prev.features.map((f: any) =>
                f.featureName === label
                    ? { ...f, count: !prev.unlimited[label] ? "Unlimited" : "", unlimited: !prev.unlimited[label] }
                    : f
            ),
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev: any) => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleImageReset = () => {
        setFormData((prev: any) => ({
            ...prev,
            image: null,
            imagePreview: null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            features: formData.features.map((f: any) => ({
                featureName: f.featureName,
                count: f.count,
            })),
            image: formData.image,
        };

        console.log("Payload to send:", payload);

        try {
            const res: AxiosResponse<any> | undefined = await EditSubscription(payload);

            if (res?.data?.success) {
                navigate("/subscriptions", { state: { updatedPlan: payload } });
            } else {
                console.error("Edit failed:", res?.data?.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error Editing subscription:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen p-8 text-sm">
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-tl-xl mb-3 rounded-br-xl border border-[#68B39F] text-[#68B39F] hover:bg-[#68B39F] hover:text-white transition"
            >
