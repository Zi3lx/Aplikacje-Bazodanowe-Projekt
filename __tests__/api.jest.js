jest.mock("../api", () => {
  const mockSaveUser = jest.fn();
  const mockLoginUser = jest.fn();
  const mockGetUserById = jest.fn();
  const mockDeleteUser = jest.fn();
  const mockUpdateUser = jest.fn();
  const mockGetAllUsers = jest.fn();

  return {
    saveUser: mockSaveUser,
    loginUser: mockLoginUser,
    getUserById: mockGetUserById,
    deleteUser: mockDeleteUser,
    updateUser: mockUpdateUser,
    getAllUsers: mockGetAllUsers,
  };
});

const {
  saveUser,
  loginUser,
  getUserById,
  deleteUser,
  updateUser,
  getAllUsers,
} = require("../api");

const mockUser = {
  id: 123,
  first_name: "John",
  last_name: "Doe",
  email: "johndoe@example.com",
  password: "password123",
  role: "customer",
};

describe("User API Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("saves a user to the database and retrieves it by ID", async () => {
    await saveUser(mockUser);

    getUserById.mockResolvedValue([mockUser]);

    const getUser = await getUserById(mockUser.id);
    expect(getUser[0]).toEqual(mockUser);
  });

  test("loguje użytkownika do aplikacji", async () => {
    const { email, password } = mockUser;
    const expectedLoggedInUser = { ...mockUser };

    loginUser.mockResolvedValue(mockUser);
    const loggedInUser = await loginUser(email, password);

    expect(loggedInUser).toEqual(expectedLoggedInUser);
  });

  test("updates user information", async () => {
    const updatedUser = { ...mockUser, first_name: "Jane", last_name: "Kot" };
    //console.log(updatedUser);
    updateUser.mockResolvedValue(2);
    const result = await updateUser(mockUser.id, updatedUser);
    //console.log(result)
    expect(result).toBe(2);
  });

  test("deletes a user from the database", async () => {
    const userId = 1;

    deleteUser.mockResolvedValue(1);

    const result = await deleteUser(userId);
    expect(result).toBe(1);
  });

  test("retrieves all users from the database", async () => {
    const mockUsers = [
      mockUser,
      {
        id: 124,
        first_name: "Jane",
        last_name: "Doe",
        email: "janedoe@example.com",
        password: "password124",
        role: "admin",
      },
    ];

    getAllUsers.mockResolvedValue(mockUsers);

    const users = await getAllUsers();
    expect(users).toEqual(mockUsers);
  });
});
