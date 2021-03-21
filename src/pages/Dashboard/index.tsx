import { useState, useEffect } from "react";

import Header from "../../components/Header";
import api from "../../services/api";
import Food from "../../components/Food";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { FoodI } from "../../types/Interface";

function Dashboard() {
  const [foods, setFoods] = useState<FoodI[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const { data } = await api.get("/foods");
      console.log(data);
      setFoods(data);
    }
    loadFoods();
  }, []);

  async function handleAddFood(food: FoodI) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodI) {
    try {
      const foodUpdated = await api.put(`/foods/${food.id}`, {
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  console.log(foods);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        // editingFood={editingFood}
        // handleUpdateFood={this.handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleUpdateFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
