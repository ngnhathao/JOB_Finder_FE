import React from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import axios from "axios";

const BecomeRecruiterModal = ({ open, onCancel, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [provinces, setProvinces] = React.useState([]);
  const [industries, setIndustries] = React.useState([]);
  const [requestSent, setRequestSent] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      fetch('https://provinces.open-api.vn/api/').then(res => res.json()).then(data => {
        setProvinces(data);
      });
      fetch('https://localhost:7266/api/Industry').then(res => res.json()).then(data => {
        setIndustries(data);
      });
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const userIdLocal = localStorage.getItem('userId');
      if (userIdLocal && localStorage.getItem('recruiterRequestSent_' + userIdLocal) === '1') {
        setRequestSent(true);
      }
    }
  }, [open]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const userIdLocal = localStorage.getItem('userId');
      const payload = {
        userId: Number(userIdLocal),
        companyName: values.companyName,
        companyProfileDescription: values.companyProfileDescription,
        location: values.location,
        teamSize: values.teamSize,
        website: values.website,
        contact: values.contact,
        industryId: Number(values.industryId),
      };
      console.log('Payload gửi lên API:', payload);
      await axios.post("https://localhost:7266/api/CandidateToCompany/request", payload);
      message.success("Request sent successfully!");
      form.resetFields();
      setRequestSent(true);
      if (userIdLocal) localStorage.setItem('recruiterRequestSent_' + userIdLocal, '1');
    } catch (err) {
      message.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="Become a Recruiter"
      okText="Submit"
      confirmLoading={loading}
      destroyOnClose
      width={520}
      footer={requestSent ? null : undefined}
    >
      {requestSent ? (
        <div style={{textAlign: 'center', padding: '30px 0', fontSize: 18, color: '#1967d2', fontWeight: 600}}>
          We have received your request, please check
        </div>
      ) : (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="Company Name" name="companyName" rules={[{ required: true, message: 'Please enter company name' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="companyProfileDescription" rules={[{ required: true, message: 'Please enter description' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please select location' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Select
              showSearch
              placeholder="Select a province/city"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
            >
              {provinces.map((item) => (
                <Select.Option key={item.code} value={item.name}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Team Size" name="teamSize" rules={[{ required: true, message: 'Please enter team size' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Select placeholder="Select team size">
              <Select.Option value="50 - 100">50 - 100</Select.Option>
              <Select.Option value="100 - 150">100 - 150</Select.Option>
              <Select.Option value="200 - 250">200 - 250</Select.Option>
              <Select.Option value="300 - 350">300 - 350</Select.Option>
              <Select.Option value="500 - 1000">500 - 1000</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Website" name="website" style={{marginBottom: 16}} help="" validateStatus="">
            <Input />
          </Form.Item>
          <Form.Item label="Contact" name="contact" rules={[{ required: true, message: 'Please enter contact' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Input />
          </Form.Item>
          <Form.Item label="Industry" name="industryId" rules={[{ required: true, message: 'Please select industry' }]} style={{marginBottom: 16}} help="" validateStatus="">
            <Select
              showSearch
              placeholder="Select industry"
              optionFilterProp="children"
              filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
            >
              {industries.map((item) => (
                <Select.Option key={item.industryId} value={item.industryId}>{item.industryName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default BecomeRecruiterModal; 