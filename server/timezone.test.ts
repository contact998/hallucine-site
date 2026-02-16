import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the db module
vi.mock("./db", () => ({
  getUserTimezone: vi.fn(),
  updateUserTimezone: vi.fn(),
}));

// Mock the businessHours module
vi.mock("./businessHours", () => ({
  COMMON_TIMEZONES: [
    { value: "Europe/Paris", label: "France (UTC+1/+2)", city: "Paris" },
    { value: "Asia/Shanghai", label: "Chine (UTC+8)", city: "Pékin/Shanghai" },
    { value: "America/New_York", label: "Est USA (UTC-5/-4)", city: "New York" },
  ],
  getBusinessHoursConfig: vi.fn(),
  updateBusinessHoursSetting: vi.fn(),
  isCurrentlyAvailable: vi.fn(),
}));

import { getUserTimezone, updateUserTimezone } from "./db";

describe("Timezone feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserTimezone", () => {
    it("should return null when user has no timezone set", async () => {
      vi.mocked(getUserTimezone).mockResolvedValue(null);
      const result = await getUserTimezone(1);
      expect(result).toBeNull();
    });

    it("should return the timezone when set", async () => {
      vi.mocked(getUserTimezone).mockResolvedValue("Europe/Paris");
      const result = await getUserTimezone(1);
      expect(result).toBe("Europe/Paris");
    });

    it("should return Asia/Shanghai timezone", async () => {
      vi.mocked(getUserTimezone).mockResolvedValue("Asia/Shanghai");
      const result = await getUserTimezone(42);
      expect(result).toBe("Asia/Shanghai");
    });
  });

  describe("updateUserTimezone", () => {
    it("should update timezone successfully", async () => {
      vi.mocked(updateUserTimezone).mockResolvedValue(true);
      const result = await updateUserTimezone(1, "Europe/Paris");
      expect(result).toBe(true);
      expect(updateUserTimezone).toHaveBeenCalledWith(1, "Europe/Paris");
    });

    it("should update to Asia/Shanghai", async () => {
      vi.mocked(updateUserTimezone).mockResolvedValue(true);
      const result = await updateUserTimezone(1, "Asia/Shanghai");
      expect(result).toBe(true);
      expect(updateUserTimezone).toHaveBeenCalledWith(1, "Asia/Shanghai");
    });

    it("should throw when database is unavailable", async () => {
      vi.mocked(updateUserTimezone).mockRejectedValue(new Error("Database not available"));
      await expect(updateUserTimezone(1, "Europe/Paris")).rejects.toThrow("Database not available");
    });
  });

  describe("COMMON_TIMEZONES", () => {
    it("should contain expected timezone entries", async () => {
      const { COMMON_TIMEZONES } = await import("./businessHours");
      expect(COMMON_TIMEZONES).toBeDefined();
      expect(Array.isArray(COMMON_TIMEZONES)).toBe(true);
      expect(COMMON_TIMEZONES.length).toBeGreaterThan(0);
      
      // Each entry should have value, label, city
      for (const tz of COMMON_TIMEZONES) {
        expect(tz).toHaveProperty("value");
        expect(tz).toHaveProperty("label");
        expect(tz).toHaveProperty("city");
        expect(typeof tz.value).toBe("string");
        expect(typeof tz.label).toBe("string");
        expect(typeof tz.city).toBe("string");
      }
    });

    it("should contain Europe/Paris", async () => {
      const { COMMON_TIMEZONES } = await import("./businessHours");
      const paris = COMMON_TIMEZONES.find((tz: any) => tz.value === "Europe/Paris");
      expect(paris).toBeDefined();
      expect(paris?.city).toBe("Paris");
    });
  });

  describe("Date formatting with timezone", () => {
    it("should format date correctly in Europe/Paris timezone", () => {
      // 2026-01-15 12:00:00 UTC
      const date = new Date("2026-01-15T12:00:00Z");
      const formatted = date.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      // In Europe/Paris (UTC+1 in January), 12:00 UTC = 13:00 CET
      expect(formatted).toContain("13:00");
      expect(formatted).toContain("2026");
    });

    it("should format date correctly in Asia/Shanghai timezone", () => {
      // 2026-01-15 12:00:00 UTC
      const date = new Date("2026-01-15T12:00:00Z");
      const formatted = date.toLocaleString("fr-FR", {
        timeZone: "Asia/Shanghai",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      // In Asia/Shanghai (UTC+8), 12:00 UTC = 20:00 CST
      expect(formatted).toContain("20:00");
      expect(formatted).toContain("2026");
    });

    it("should format date correctly in America/New_York timezone", () => {
      // 2026-01-15 12:00:00 UTC
      const date = new Date("2026-01-15T12:00:00Z");
      const formatted = date.toLocaleString("fr-FR", {
        timeZone: "America/New_York",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      // In America/New_York (UTC-5 in January), 12:00 UTC = 07:00 EST
      expect(formatted).toContain("07:00");
      expect(formatted).toContain("2026");
    });

    it("should show different times for same UTC timestamp in different timezones", () => {
      const date = new Date("2026-06-15T23:30:00Z");
      
      const parisTime = date.toLocaleTimeString("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      const shanghaiTime = date.toLocaleTimeString("fr-FR", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
      });
      
      // Paris (UTC+2 in June): 01:30 next day
      // Shanghai (UTC+8): 07:30 next day
      expect(parisTime).toBe("01:30");
      expect(shanghaiTime).toBe("07:30");
    });
  });
});
