import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { getToken } from "../lib/auth";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!getToken()) {
      setFavoriteIds(new Set());
      setLoading(false);
      return;
    }
    try {
      const response = await api.get<Array<{ fieldId: number }>>("/favorites");
      setFavoriteIds(new Set(response.data.map((favorite) => Number(favorite.fieldId))));
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
    window.addEventListener("auth-change", loadFavorites);
    return () => window.removeEventListener("auth-change", loadFavorites);
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (fieldId: number) => {
    if (!getToken()) {
      toast.error("Vui lòng đăng nhập để lưu sân yêu thích");
      return false;
    }
    const isFavorite = favoriteIds.has(fieldId);
    try {
      if (isFavorite) await api.delete(`/favorites/${fieldId}`);
      else await api.post("/favorites", { fieldId });
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (isFavorite) next.delete(fieldId);
        else next.add(fieldId);
        return next;
      });
      toast.success(isFavorite ? "Đã bỏ sân khỏi yêu thích" : "Đã lưu sân yêu thích");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật sân yêu thích");
      return false;
    }
  }, [favoriteIds]);

  return { favoriteIds, isFavorite: (fieldId: number) => favoriteIds.has(fieldId), toggleFavorite, loading };
}
