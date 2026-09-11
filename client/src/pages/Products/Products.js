import { Table, PageHeader, Button } from 'antd';
import { useEffect, useState } from 'react';
import FormProduct from '../../components/FormProduct/FormProduct';
import { deleteProduct, getProducts } from '../../services/products.service';
import { DeleteOutlined } from '@ant-design/icons';

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data.data.products);
    };

    fetchProducts();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const addProductToList = async (product) => {
    setProducts([...products, product]);
    closeModal();
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);

    const newProducts = [...products];
    const index = products.findIndex((product) => product.id === id);
    newProducts.splice(index, 1);

    setProducts(newProducts);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },

    {
      title: 'Qntd.',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Preço',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Data de Fabricação',
      dataIndex: 'manufacturing_date',
      key: 'manufacturing_date',
    },
    {
      title: 'Data de Vencimento',
      dataIndex: 'due_date',
      key: 'due_date',
    },
    {
      title: 'Ações',
      key: 'action',
      render: (text, record) => (
        <Button type="danger" onClick={() => removeProduct(record.id)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Produtos"
        extra={[
          <Button key="1" type="primary" onClick={showModal}>
            Adicionar
          </Button>,
        ]}
      ></PageHeader>
      <Table dataSource={products} columns={columns} rowKey="id" />
      <FormProduct isModalVisible={isModalVisible} closeModal={closeModal} onFinish={addProductToList} />
    </>
  );
}

export default Products;
