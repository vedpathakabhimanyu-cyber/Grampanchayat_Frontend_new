"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { historicalAPI } from "@/lib/admin/api";
import { toast } from "sonner";

type HistoricalEvent = {
  id?: string;
  year: string;
  eventName: string;
  additionalInfo: string;
};

type HistoricalPlace = {
  id?: string;
  placeName: string;
  placeInfo: string;
  image?: string;
};

type HistoricalAward = {
  id?: string;
  awardName: string;
  awardDescription: string;
  year: string;
};

type HistoricalData = {
  events: HistoricalEvent[];
  places: HistoricalPlace[];
  awards: HistoricalAward[];
};

export default function TaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingEvents, setExistingEvents] = useState<HistoricalEvent[]>([]);
  const [existingPlaces, setExistingPlaces] = useState<HistoricalPlace[]>([]);
  const [existingAwards, setExistingAwards] = useState<HistoricalAward[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    events: [{ year: "", eventName: "", additionalInfo: "" }],
    places: [{ placeName: "", placeInfo: "" }],
    awards: [{ awardName: "", awardDescription: "", year: "" }],
  });

  // Modal States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    name: string;
    type: "event" | "place" | "award";
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing data from backend
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await historicalAPI.get();
        if (response && response.success && response.data) {
          setExistingEvents(response.data.events || []);
          setExistingPlaces(response.data.places || []);
          setExistingAwards(response.data.awards || []);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, []);

  // Delete event
  const deleteEvent = async (id: string, eventName: string) => {
    setDeletingItem({ id, name: eventName, type: "event" });
    setIsDeleteModalOpen(true);
  };

  // Delete place
  const deletePlace = async (id: string, placeName: string) => {
    setDeletingItem({ id, name: placeName, type: "place" });
    setIsDeleteModalOpen(true);
  };

  // Delete award
  const deleteAward = async (id: string, awardName: string) => {
    setDeletingItem({ id, name: awardName, type: "award" });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      if (deletingItem.type === "event") {
        await historicalAPI.deleteEvent(deletingItem.id);
        setExistingEvents(
          existingEvents.filter((event) => event.id !== deletingItem.id)
        );
      } else if (deletingItem.type === "place") {
        await historicalAPI.deletePlace(deletingItem.id);
        setExistingPlaces(
          existingPlaces.filter((place) => place.id !== deletingItem.id)
        );
      } else if (deletingItem.type === "award") {
        await historicalAPI.deleteAward(deletingItem.id);
        setExistingAwards(
          existingAwards.filter((award) => award.id !== deletingItem.id)
        );
      }
      toast.success("यशस्वीरित्या हटवले!");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("त्रुटी: हटवताना समस्या आली");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
    }
  };

  // Edit event - load into form
  const editEvent = (event: HistoricalEvent) => {
    setEditingItem({ ...event });
    setIsEditModalOpen(true);
  };

  // Edit place
  const editPlace = (place: HistoricalPlace) => {
    setEditingItem({ ...place });
    setIsEditModalOpen(true);
  };

  // Edit award
  const editAward = (award: HistoricalAward) => {
    setEditingItem({ ...award });
    setIsEditModalOpen(true);
  };

  const handleModalSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    try {
      let events: HistoricalEvent[] = [];
      let places: HistoricalPlace[] = [];
      let awards: HistoricalAward[] = [];

      if ('eventName' in editingItem) {
        events = [editingItem];
      } else if ('placeName' in editingItem) {
        places = [editingItem];
      } else if ('awardName' in editingItem) {
        awards = [editingItem];
      }

      const response = await historicalAPI.save(events, places, awards);
      if (response && response.success) {
        // Refresh local state
        if ('eventName' in editingItem) {
          setExistingEvents(prev => prev.map(e => e.id === editingItem.id ? editingItem : e));
        } else if ('placeName' in editingItem) {
          setExistingPlaces(prev => prev.map(p => p.id === editingItem.id ? editingItem : p));
        } else if ('awardName' in editingItem) {
          setExistingAwards(prev => prev.map(a => a.id === editingItem.id ? editingItem : a));
        }
          toast.success("बदल यशस्वीरित्या जतन केले!");
          setIsEditModalOpen(false);
          setEditingItem(null);
        }
      } catch (error) {
        console.error("Error saving:", error);
        toast.error("त्रुटी: जतन करताना समस्या आली");
      } finally {
      setSaving(false);
    }
  };

  const addEvent = () => {
    setHistoricalData({
      ...historicalData,
      events: [
        ...historicalData.events,
        { year: "", eventName: "", additionalInfo: "" },
      ],
    });
  };

  const addPlace = () => {
    setHistoricalData({
      ...historicalData,
      places: [...historicalData.places, { placeName: "", placeInfo: "" }],
    });
  };

  const addAward = () => {
    setHistoricalData({
      ...historicalData,
      awards: [
        ...historicalData.awards,
        { awardName: "", awardDescription: "", year: "" },
      ],
    });
  };

  const handleEventChange = (
    index: number,
    field: keyof HistoricalEvent,
    value: string
  ) => {
    const newEvents = [...historicalData.events];
    newEvents[index][field] = value;
    setHistoricalData({ ...historicalData, events: newEvents });
  };

  const handlePlaceChange = (
    index: number,
    field: keyof HistoricalPlace,
    value: string
  ) => {
    const newPlaces = [...historicalData.places];
    newPlaces[index][field] = value;
    setHistoricalData({ ...historicalData, places: newPlaces });
  };

  const handleAwardChange = (
    index: number,
    field: keyof HistoricalAward,
    value: string
  ) => {
    const newAwards = [...historicalData.awards];
    newAwards[index][field] = value;
    setHistoricalData({ ...historicalData, awards: newAwards });
  };

  const removeEvent = (index: number) => {
    setHistoricalData({
      ...historicalData,
      events: historicalData.events.filter((_, i) => i !== index),
    });
  };

  const removePace = (index: number) => {
    setHistoricalData({
      ...historicalData,
      places: historicalData.places.filter((_, i) => i !== index),
    });
  };

  const removeAward = (index: number) => {
    setHistoricalData({
      ...historicalData,
      awards: historicalData.awards.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const isValid =
      historicalData.events.every((event) => event.year && event.eventName) &&
      historicalData.places.every((place) => place.placeName) &&
      historicalData.awards.every((award) => award.awardName);

    if (!isValid) {
      toast.warning("कृपया सर्व आवश्यक माहिती भरा");
      return;
    }

    try {
      // Save to backend - use camelCase
      const events = historicalData.events.map((event) => ({
        id: event.id,
        year: event.year,
        eventName: event.eventName,
        additionalInfo: event.additionalInfo,
      }));

      const places = historicalData.places.map((place) => ({
        id: place.id,
        placeName: place.placeName,
        placeInfo: place.placeInfo,
        image: place.image,
      }));

      const awards = historicalData.awards.map((award) => ({
        id: award.id,
        awardName: award.awardName,
        awardDescription: award.awardDescription,
        year: award.year,
      }));

      await historicalAPI.save(events, places, awards);

      // Also save to localStorage as backup
      localStorage.setItem("task6", JSON.stringify(historicalData));
      window.dispatchEvent(new Event("taskUpdate"));

      toast.success("ऐतिहासिक माहिती यशस्वीरित्या जतन केली!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error saving historical data:", error);
      toast.error("त्रुटी: " + (error.message || "डेटा जतन करताना समस्या आली"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto font-inter">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 text-center animate-fadeIn">
          कार्य 6: गावाबद्दल विशेष माहिती / घटना
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <>
            {/* Existing Historical Events */}
            {existingEvents.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  सध्याच्या ऐतिहासिक घटना ({existingEvents.length})
                </h3>
                <div className="space-y-3">
                  {existingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2 mb-2">
                            <span className="text-blue-600 font-bold text-lg">
                              {event.year}
                            </span>
                            <span className="text-gray-800 font-semibold">
                              {event.eventName}
                            </span>
                          </div>
                          {event.additionalInfo && (
                            <p className="text-sm text-gray-600 mt-1">
                              {event.additionalInfo}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <button
                            onClick={() => editEvent(event)}
                            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                            title="संपादन करा (Edit)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              deleteEvent(event.id!, event.eventName)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="हटवा"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Historical Places */}
            {existingPlaces.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  सध्याची ऐतिहासिक स्थळे ({existingPlaces.length})
                </h3>
                <div className="space-y-3">
                  {existingPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-base mb-1">
                            {place.placeName}
                          </h4>
                          {place.placeInfo && (
                            <p className="text-sm text-gray-600">
                              {place.placeInfo}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <button
                            onClick={() => editPlace(place)}
                            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                            title="संपादन करा (Edit)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              deletePlace(place.id!, place.placeName)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="हटवा"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Historical Awards */}
            {existingAwards.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  सध्याचे पुरस्कार ({existingAwards.length})
                </h3>
                <div className="space-y-3">
                  {existingAwards.map((award) => (
                    <div
                      key={award.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-baseline space-x-2 mb-2">
                            {award.year && (
                              <span className="text-blue-600 font-bold text-lg">
                                {award.year}
                              </span>
                            )}
                            <span className="text-gray-800 font-semibold">
                              {award.awardName}
                            </span>
                          </div>
                          {award.awardDescription && (
                            <p className="text-sm text-gray-600 mt-1">
                              {award.awardDescription}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 ml-2">
                          <button
                            onClick={() => editAward(award)}
                            className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-blue-50"
                            title="संपादन करा (Edit)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              deleteAward(award.id!, award.awardName)
                            }
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="हटवा"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Section Header */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                नवीन ऐतिहासिक माहिती जोडा
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Historical Events Section */}
              <div id="events-section" className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  ऐतिहासिक संदर्भ
                </h3>

                {historicalData.events.map((event, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border rounded-lg relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          वर्ष <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={event.year}
                          onChange={(e) =>
                            handleEventChange(index, "year", e.target.value)
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          ऐतिहासिक घटना <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={event.eventName}
                          onChange={(e) =>
                            handleEventChange(
                              index,
                              "eventName",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          placeholder="मराठी मध्ये"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          अधिक माहिती
                        </label>
                        <textarea
                          value={event.additionalInfo}
                          onChange={(e) =>
                            handleEventChange(
                              index,
                              "additionalInfo",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          rows={3}
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEvent}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + आणखी घटना जोडा
                </button>
              </div>

              {/* Historical Places Section */}
              <div id="places-section" className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  ऐतिहासिक ठिकाणे
                </h3>

                {historicalData.places.map((place, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border rounded-lg relative"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          ठिकाणाचे नाव <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={place.placeName}
                          onChange={(e) =>
                            handlePlaceChange(
                              index,
                              "placeName",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          placeholder="मराठी मध्ये"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          ठिकाणाची माहिती
                        </label>
                        <textarea
                          value={place.placeInfo}
                          onChange={(e) =>
                            handlePlaceChange(
                              index,
                              "placeInfo",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          rows={3}
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removePace(index)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPlace}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + आणखी ठिकाण जोडा
                </button>
              </div>

              {/* Historical Awards Section */}
              <div id="awards-section" className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  पुरस्कार
                </h3>

                {historicalData.awards.map((award, index) => (
                  <div
                    key={index}
                    className="mb-6 p-4 border rounded-lg relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          पुरस्कारचे नाव <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={award.awardName}
                          onChange={(e) =>
                            handleAwardChange(
                              index,
                              "awardName",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          placeholder="मराठी मध्ये"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          वर्ष
                        </label>
                        <input
                          type="text"
                          value={award.year}
                          onChange={(e) =>
                            handleAwardChange(index, "year", e.target.value)
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          placeholder="उदा. २०२३"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          पुरस्कारचे विवरण
                        </label>
                        <textarea
                          value={award.awardDescription}
                          onChange={(e) =>
                            handleAwardChange(
                              index,
                              "awardDescription",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg px-4 py-2"
                          rows={3}
                          placeholder="पुरस्कारविषयी अधिक माहिती..."
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeAward(index)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAward}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + आणखी पुरस्कार जोडा
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-200 hover:scale-105"
                >
                  सबमिट करा
                </button>
              </div>
            </form>
          </>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 transform transition-all">
              <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold">माहिती संपादित करा</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8 space-y-5">
                {'eventName' in editingItem ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">वर्ष</label>
                      <input 
                        type="text" 
                        value={editingItem.year} 
                        onChange={(e) => setEditingItem({...editingItem, year: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">घटना</label>
                      <input 
                        type="text" 
                        value={editingItem.eventName} 
                        onChange={(e) => setEditingItem({...editingItem, eventName: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">अधिक माहिती</label>
                      <textarea 
                        value={editingItem.additionalInfo} 
                        onChange={(e) => setEditingItem({...editingItem, additionalInfo: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                        rows={3}
                      />
                    </div>
                  </>
                ) : 'placeName' in editingItem ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ठिकाणाचे नाव</label>
                      <input 
                        type="text" 
                        value={editingItem.placeName} 
                        onChange={(e) => setEditingItem({...editingItem, placeName: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ठिकाणाची माहिती</label>
                      <textarea 
                        value={editingItem.placeInfo} 
                        onChange={(e) => setEditingItem({...editingItem, placeInfo: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">पुरस्काराचे नाव</label>
                      <input 
                        type="text" 
                        value={editingItem.awardName} 
                        onChange={(e) => setEditingItem({...editingItem, awardName: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">वर्ष</label>
                      <input 
                        type="text" 
                        value={editingItem.year} 
                        onChange={(e) => setEditingItem({...editingItem, year: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">विवरण</label>
                      <textarea 
                        value={editingItem.awardDescription} 
                        onChange={(e) => setEditingItem({...editingItem, awardDescription: e.target.value})}
                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-0 transition-all outline-none bg-gray-50"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleModalSave}
                  disabled={saving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                >
                  {saving ? 'जतन होत आहे...' : 'बदल जतन करा'}
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-bold py-3 rounded-xl transition-all"
                >
                  रद्द करा
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && deletingItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">नक्की हटवायचे?</h3>
              <p className="text-gray-600 mb-8 px-4">
                तुम्ही <span className="font-bold text-red-600">"{deletingItem.name}"</span> ही माहिती कायमची हटवत आहात. ही क्रिया पुन्हा मागे घेता येणार नाही.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-200"
                >
                  हो, हटवा
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all"
                >
                  रद्द करा
                </button>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s ease forwards;
          }
        `}
        </style>
      </div>
    </div>
  );
}
