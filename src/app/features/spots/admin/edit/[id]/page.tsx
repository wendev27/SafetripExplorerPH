"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const spotSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  location: z.string().min(2),
  category: z.string().min(2),
  price: z.number().min(0),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

type SpotInputs = z.infer<typeof spotSchema>;

function AdminEditSpotPage() {
  const router = useRouter();
  const { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<SpotInputs>({
    resolver: zodResolver(spotSchema),
  });

  useEffect(() => {
    if (!id) return;

    // Fetch existing spot data
    fetch(`/api/admin/spots/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const spot = data.data;
          setValue("title", spot.title);
          setValue("description", spot.description);
          setValue("location", spot.location);
          setValue("category", spot.category);
          setValue("price", spot.price);
          setImages(spot.images || []);
          setAmenitiesInput((spot.amenities || []).join(", "));
        }
      })
      .catch((error) => {
        console.error("Error fetching spot:", error);
        alert("Failed to load spot data");
      })
      .finally(() => setLoading(false));
  }, [id, setValue]);

  const onSubmit = async (data: SpotInputs) => {
    setSaving(true);
    try {
      const amenities = amenitiesInput
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");

      const response = await axios.put(`/api/admin/spots/${id}`, {
        ...data,
        images,
        amenities,
      });

      if (response.data.success) {
        alert("Tourist spot updated successfully!");
        router.push("/features/dashboard/admin");
      } else {
        alert("Failed to update spot");
      }
    } catch (error) {
      console.error("Error updating spot:", error);
      alert("Failed to update spot");
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-6">Loading spot data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Tourist Spot</h1>
        <p className="text-gray-500 mt-1">
          Update details, pricing, and images for this location.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-sm border"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Location & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              {...register("location")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              {...register("category")}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price (₱)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Images</label>

          <div className="space-y-3">
            {images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  className="flex-1 p-3 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addImage}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another image
            </button>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Amenities (comma-separated)
          </label>
          <input
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            placeholder="WiFi, Parking, Restaurant..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Spot"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Explicit default export to satisfy Next.js page expectations
export default AdminEditSpotPage;
