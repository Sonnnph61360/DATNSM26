import Court from "../models/Court";

export async function getCourts(req, res) {
  try {
    const courts = await Court.find();
    return res.json(courts);
  } catch (error) {
    return res.json({ error: error.message });
  }
}


export async function addCourt(req, res) {
  try {
    const newCourt = await Court.create(req.body);
    return res.status(201).json(newCourt);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}