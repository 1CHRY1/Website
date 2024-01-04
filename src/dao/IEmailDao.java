package dao;

import controller.EmailEntity;

public interface IEmailDao {
    String sendEmail(EmailEntity emailEntity);
}
