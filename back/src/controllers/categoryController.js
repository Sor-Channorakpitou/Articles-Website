import * as categoryRepository from "../repositories/sqlCategoryRepository.js"
export async function getCategories(req,res) {
  try {
    const categories = await categoryRepository.getCategories();
    res.json(categories);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}