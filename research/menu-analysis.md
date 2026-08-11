# Menu Analysis & Normalization

## General Patterns Discovered
- **Breakfast:** Typically consists of a primary item (Paratha, Poha, Chilla, Upma, Idli/Dosa) accompanied by tea/coffee/milk and a side (chutney, pickle, curd, sambar). Bread/Butter/Jam is a frequent quick alternative.
- **Lunch:** Generally heavier, following a thali structure: 1 Dal, 1 Dry Sabzi or Gravy Sabzi, Rice (Jeera Rice, Plain Rice, or Pulao), Roti/Chapati, Salad, and sometimes Raita/Curd.
- **Dinner:** Often similar to lunch but sometimes features special items (Paneer dishes, Chole, Rajma) or lighter alternatives (Khichdi).
- **Snacks (Optional):** Samosa, Kachori, Maggi, Bread Pakora.

## Seasonal Patterns
- **Winter:** Features heavy greens (Sarson ka Saag, Bathua Paratha, Methi Aloo, Palak Paneer), root vegetables (Gajar Matar, Mooli Paratha), and warming grains (Makki ki Roti, Bajra).
- **Summer:** Lighter foods, cooling vegetables (Lauki chana dal, Tori sabzi, Bhindi, Tinda, Kadhi, Cucumber Raita).
- **Monsoon:** Pakoras, spicy gravies, roasted corn.
- **All-season:** Staples like Toor Dal, Chana Masala, Aloo Gobi, Paneer Butter Masala, Rajma Chawal.

## Recipe Normalization Decisions
- Variants like "Aloo Gobhi", "Aloo Gobi Sabzi" are normalized to "Aloo Gobi".
- "Parantha" -> "Paratha".
- Dals are specified where important (e.g., "Dal Makhani", "Dal Tadka", "Moong Dal", "Panchmel Dal").
- Main combos are listed as separate recipes for random selection, but we can also treat Dal/Sabzi/Rice as separate components. The prompt suggests recipes like "Kadhi Chawal" and "Aloo Paratha".
