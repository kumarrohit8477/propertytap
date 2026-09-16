import { useEffect, useState, useCallback } from 'react';
import { get_properties } from '@/lib/properties/property_service';
import { PropertyFilterParams, PropertyItem } from '@/types/property';

export function use_properties(initial_params: PropertyFilterParams = {}) {
  const [properties, set_properties] = useState<PropertyItem[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);
  const [params, set_params] = useState<PropertyFilterParams>(initial_params);

  const fetch_properties = useCallback(async (filter_params: PropertyFilterParams) => {
    set_loading(true);
    set_error(null);
    const { properties: data, error: err } = await get_properties(filter_params);
    if (err) {
      set_error(err.message);
    } else {
      set_properties(data);
    }
    set_loading(false);
  }, []);

  useEffect(() => {
    fetch_properties(params);
  }, [params, fetch_properties]);

  const update_filters = (new_filters: Partial<PropertyFilterParams>) => {
    set_params((prev) => ({ ...prev, ...new_filters, page: 1 }));
  };

  return { properties, loading, error, params, update_filters, refetch: () => fetch_properties(params) };
}
