import { create } from "zustand";
import { DriverStore, LocationStore, MarkerData } from "@/types/types";

// Create the driver store first
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

// Then create the location store with a reference to the driver store
export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // First update the location state
    set({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    });

    // Then handle the driver store update
    const driverStore = useDriverStore.getState();
    if (driverStore.selectedDriver) {
      driverStore.clearSelectedDriver();
    }
  },
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // First update the destination state
    set({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    });

    // Then handle the driver store update
    const driverStore = useDriverStore.getState();
    if (driverStore.selectedDriver) {
      driverStore.clearSelectedDriver();
    }
  },
}));
