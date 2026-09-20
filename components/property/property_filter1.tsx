'use client';

import React, { useState } from 'react';
import { PropertyFilterParams, PropertyCategory } from '@/types/property';
import Button from '@/components/ui/button';
import './property_filter1.css';

interface PropertyFiltersProps {
  categories: PropertyCategory[];
  initial_filters?: PropertyFilterParams;
  on_filter_change: (filters: PropertyFilterParams) => void;
}

interface BudgetOption {
  label: string;
  min?: number;
  max?: number;
}

const budget_options: BudgetOption[] = [
  {
    label: 'Any Budget',
  },
  {
    label: 'Up to ₹5 Lakh',
    max: 500000,
  },
  {
    label: 'Up to ₹10 Lakh',
    max: 1000000,
  },
  {
    label: 'Up to ₹25 Lakh',
    max: 2500000,
  },
  {
    label: 'Up to ₹50 Lakh',
    max: 5000000,
  },
  {
    label: 'Up to ₹1 Crore',
    max: 10000000,
  },
  {
    label: '₹50 Lakh – ₹1 Crore',
    min: 5000000,
    max: 10000000,
  },
  {
    label: '₹1 Crore – ₹2.5 Crore',
    min: 10000000,
    max: 25000000,
  },
  {
    label: '₹2.5 Crore – ₹5 Crore',
    min: 25000000,
    max: 50000000,
  },
  {
    label: '₹5 Crore+',
    min: 50000000,
  },
];

export default function PropertyFilters({
  categories = [],
  initial_filters = {},
  on_filter_change,
}: PropertyFiltersProps) {
  const [city, set_city] = useState(initial_filters.city || '');

  const [purpose, set_purpose] = useState<string>(
    initial_filters.purpose || ''
  );

  const [category_id, set_category_id] = useState(
    initial_filters.category_id || ''
  );

  const get_initial_budget = () => {
    const min = initial_filters.min_price;
    const max = initial_filters.max_price;

    const index = budget_options.findIndex(
      (option) =>
        option.min === min &&
        option.max === max
    );

    return index >= 0 ? String(index) : '';
  };

  const [budget, set_budget] = useState(get_initial_budget());

  const handle_apply = () => {
    const selected_budget =
      budget_options[Number(budget) || 0];

    on_filter_change({
      city: city || undefined,

      purpose: (purpose as any) || undefined,

      category_id: category_id || undefined,

      min_price: selected_budget.min,

      max_price: selected_budget.max,

      sort_by: 'newest',
    });
  };

  const handle_reset = () => {
    set_city('');
    set_purpose('');
    set_category_id('');
    set_budget('');

    on_filter_change({
      sort_by: 'newest',
    });
  };

  return (
    <div className="property_filters_wrapper">
      <div className="property_filters_bar">

        {/* Location */}
        <div className="property_filter_item property_location_item">
          <label className="property_filter_label">
            Location
          </label>

          <input
            type="text"
            className="property_filter_input"
            placeholder="Enter city or location"
            value={city}
            onChange={(e) => set_city(e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div className="property_filter_item property_type_item">
          <label className="property_filter_label">
            Property Type
          </label>

          <div className="property_type_buttons">
            <button
              type="button"
              className={`property_type_button ${
                purpose === 'sale' ? 'active' : ''
              }`}
              onClick={() =>
                set_purpose(
                  purpose === 'sale' ? '' : 'sale'
                )
              }
            >
              Buy
            </button>

            <button
              type="button"
              className={`property_type_button ${
                purpose === 'rent' ? 'active' : ''
              }`}
              onClick={() =>
                set_purpose(
                  purpose === 'rent' ? '' : 'rent'
                )
              }
            >
              Rent
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="property_filter_item">
          <label className="property_filter_label">
            Category
          </label>

          <select
            className="property_filter_select"
            value={category_id}
            onChange={(e) =>
              set_category_id(e.target.value)
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="property_filter_item property_budget_item">
          <label className="property_filter_label">
            Budget
          </label>

          <select
            className="property_filter_select property_budget_select"
            value={budget}
            onChange={(e) =>
              set_budget(e.target.value)
            }
          >
            {budget_options.map(
              (option, index) => (
                <option
                  key={index}
                  value={String(index)}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>
        {/* Search */}
        <div className="property_filter_search">
          <Button
            variant="primary"
            onClick={handle_apply}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}