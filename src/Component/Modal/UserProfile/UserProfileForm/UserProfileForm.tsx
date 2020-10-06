import React, {
  useEffect,
  useState
} from 'react';

import {
  useRecoilState
} from 'recoil';

import {
  Form,
  Alert,
  Input,
  Button,
  Select,
  Tooltip
} from 'antd';

import {
  ContactsOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@ant-design/icons';

import UserService from '../../../../Service/UserService/UserService';

import User, { UserArgs } from '../../../../Model/User';

import './UserProfileForm.less';
import { userInfoAtom } from '../../../../State/atoms';

interface AlertProps {
  type?: 'success' | 'info' | 'warning' | 'error';
  message?: string;
}

interface OwnProps {}

type UserProfileFormProps = OwnProps;

export const UserProfileForm: React.FC<UserProfileFormProps> = props => {

  const {
    ...restProps
  } = props;

  const userRoles = ['User', 'Admin'];

  const [form] = Form.useForm();
  const [alert, setAlert] = useState<AlertProps | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo] = useRecoilState(userInfoAtom);

  useEffect(() => {
    form.setFieldsValue({
      email: userInfo?.keycloakRepresentation?.email,
      username: userInfo?.keycloakRepresentation?.username,
      affiliation: userInfo?.details?.affiliation,
      phone: userInfo?.details?.phone,
      about: userInfo?.details?.about
    });
  }, [userInfo]);

  const handleSubmit = (values) => {
    setAlert({});
    setLoading(true);

    const updateUser = new User({
      id: userInfo.id,
      keycloakRepresentation: {
        username: values.username,
        email: userInfo?.keycloakRepresentation?.email,
        enabled: true
      },
      details: {
        phone: values?.phone,
        about: values?.about,
        affiliation: values?.affiliation,
        roles: values?.roles?.map((role: string) => {
          if (userRoles.includes(role)) {
            return role;
          } else {
            return userRoles[parseInt(role, 10)];
          }
        })
      }
    });

    const userService = new UserService();

    userService.update(updateUser)
      .then((updatedUser: UserArgs) => {
        setAlert({
          type: 'success',
          message: 'Successfully updated the user profile.'
        });
      })
      .catch(() => {
        setAlert({
          type: 'error',
          message: 'Error while trying to update the user profile.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Form
      className="user-profile-form"
      form={form}
      onFinish={handleSubmit}
      labelCol={{
        sm: { span: 4 }
      }}
      wrapperCol={{
        sm: { span: 20 }
      }}
      {...restProps}
    >
      {/* <img
        className="user-profile-image"
        src={GravatarUtil.getUrl({
          email: user.email || '',
          size: 60
        })}
      /> */}
      {
        alert?.type &&
        <Alert
          style={{
            marginBottom: 24
          }}
          message={alert.message}
          type={alert.type}
          showIcon
          closable
        />
      }
      <Form.Item
        name="username"
        label="Name"
        rules={[{
          required: true,
          message: 'Please input a username!'
        }]}
      >
        <Input
          prefix={
            <UserOutlined
              style={{
                color: 'rgba(0,0,0,.25)'
              }}
            />
          }
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="affiliation"
        label="Affiliation"
      >
        <Input
          prefix={
            <ContactsOutlined
              style={{
                color: 'rgba(0,0,0,.25)'
              }}
            />
          }
          placeholder="Affiliation"
        />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone"
      >
        <Input
          prefix={
            <PhoneOutlined
              style={{
                color: 'rgba(0,0,0,.25)'
              }}
            />
          }
          placeholder="Phone"
        />
      </Form.Item>
      <Form.Item
        name="about"
        label={<span>
          About&nbsp;
          <Tooltip title="Please tell us something about yourself">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>}
      >
        <Input.TextArea
          placeholder="About"
        />
      </Form.Item>
      <Form.Item
        name="roles"
        label={<span>
          Roles&nbsp;
          <Tooltip title="Please select your roles">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>}
      >
        <Select
          mode="multiple"
          placeholder="Roles"
          disabled={true}
        >
          {
            userRoles?.map((keyword: string, i: number) => {
              return <Select.Option
                value={i.toString()}
                key={i.toString()}
              >
                {keyword}
              </Select.Option>;
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label="E-Mail"
      >
        <Input
          prefix={
            <MailOutlined
              style={{
                color: 'rgba(0,0,0,.25)'
              }}
            />
          }
          disabled={true}
          placeholder="Email"
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        className="user-profile-form-button"
        loading={loading}
      >
        Save
      </Button>
    </Form>
  );
};

export default UserProfileForm;
