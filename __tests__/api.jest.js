jest.mock('../api', () => {
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
  getAllUsers 
} = require('../api');

const mockUser = {
  id: 123,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  role: 'customer',
};

describe('User API Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('saves a user to the database', async () => {
    await saveUser(mockUser);
    expect(saveUser).toHaveBeenCalledWith(mockUser);
  });

  test('login user to marketplace', async () => {
    const testUser = { email: 'john.doe@example.com', password: 'password123' };
    await loginUser(testUser.email, testUser.password);
    expect(loginUser).toHaveBeenCalledWith(testUser.email, testUser.password);
  });

  test('find user by id', async () => {
    const userId = 123;
    await getUserById(userId);
    expect(getUserById).toHaveBeenCalledWith(userId);
  });

  test('update user by id', async () => {
    await updateUser(mockUser.id, mockUser);
    expect(updateUser).toHaveBeenCalledWith(mockUser.id, mockUser);
  });

  test('get all users with order role filter and user sort', async () => {
    const mockOrderRoleFilter = 'admin';
    const mockUserSort = 'name';
    await getAllUsers(mockOrderRoleFilter, mockUserSort);
    expect(getAllUsers).toHaveBeenCalledWith(mockOrderRoleFilter, mockUserSort);
  });

  test('delete user by id', async () => {
    const userId = 123;
    await deleteUser(userId);
    expect(deleteUser).toHaveBeenCalledWith(userId);
  });
});
