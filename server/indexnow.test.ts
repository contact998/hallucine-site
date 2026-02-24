import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock axios
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from "axios";
import { submitToIndexNow, submitSingleUrl } from "./indexnow";

const mockedPost = vi.mocked(axios.post);

describe("IndexNow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("soumet toutes les URLs publiques avec succès (status 200)", async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: "" });

    const result = await submitToIndexNow();

    expect(result.success).toBe(true);
    expect(result.submitted).toBe(27);
    expect(mockedPost).toHaveBeenCalledTimes(1);

    const callArgs = mockedPost.mock.calls[0];
    expect(callArgs[0]).toBe("https://api.indexnow.org/indexnow");
    expect(callArgs[1]).toHaveProperty("host", "hallucinecran.fr");
    expect(callArgs[1]).toHaveProperty("key");
    expect(callArgs[1].urlList).toHaveLength(27);
    expect(callArgs[1].urlList[0]).toBe("https://hallucinecran.fr/");
  });

  it("soumet toutes les URLs publiques avec succès (status 202)", async () => {
    mockedPost.mockResolvedValueOnce({ status: 202, data: "" });

    const result = await submitToIndexNow();

    expect(result.success).toBe(true);
    expect(result.submitted).toBe(27);
  });

  it("gère une erreur réseau", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Network error"));

    const result = await submitToIndexNow();

    expect(result.success).toBe(false);
    expect(result.submitted).toBe(0);
    expect(result.error).toContain("Network error");
  });

  it("gère un status inattendu", async () => {
    mockedPost.mockResolvedValueOnce({ status: 422, data: "Invalid key" });

    const result = await submitToIndexNow();

    expect(result.success).toBe(false);
    expect(result.error).toContain("422");
  });

  it("soumet une URL spécifique", async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: "" });

    const success = await submitSingleUrl("https://hallucinecran.fr/blog");

    expect(success).toBe(true);
    expect(mockedPost.mock.calls[0][1].urlList).toEqual(["https://hallucinecran.fr/blog"]);
  });

  it("soumet des URLs personnalisées", async () => {
    mockedPost.mockResolvedValueOnce({ status: 200, data: "" });

    const customUrls = [
      "https://hallucinecran.fr/blog/article-1",
      "https://hallucinecran.fr/blog/article-2",
    ];
    const result = await submitToIndexNow(customUrls);

    expect(result.success).toBe(true);
    expect(result.submitted).toBe(2);
    expect(mockedPost.mock.calls[0][1].urlList).toEqual(customUrls);
  });
});
