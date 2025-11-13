"""
AWS SNS SMS provider implementation
"""
from typing import Optional
import boto3
from botocore.exceptions import ClientError
from .base import SMSProvider


class AWSSNSProvider(SMSProvider):
    """
    AWS SNS SMS provider for production use
    Requires: pip install boto3
    """

    def __init__(
        self,
        aws_access_key_id: str,
        aws_secret_access_key: str,
        region_name: str = "us-east-1"
    ):
        """
        Initialize AWS SNS SMS provider

        Args:
            aws_access_key_id: AWS Access Key ID
            aws_secret_access_key: AWS Secret Access Key
            region_name: AWS region (default: us-east-1)
        """
        self.region_name = region_name
        self.sns_client = boto3.client(
            'sns',
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key,
            region_name=region_name
        )
        print(f"[AWS SNS] Provider initialized in region: {region_name}")

    async def send_sms(
        self,
        to_phone: str,
        message: str,
        from_phone: Optional[str] = None
    ) -> bool:
        """
        Send SMS via AWS SNS

        Args:
            to_phone: Recipient phone number in E.164 format (e.g., +886912345678)
            message: Message content
            from_phone: Sender ID (optional, not all countries support this)

        Returns:
            bool: True if sent successfully

        Raises:
            Exception: If SMS sending fails
        """
        try:
            # Prepare SNS publish parameters
            params = {
                'PhoneNumber': to_phone,
                'Message': message,
                'MessageAttributes': {
                    'AWS.SNS.SMS.SMSType': {
                        'DataType': 'String',
                        'StringValue': 'Transactional'  # Use Transactional for verification codes
                    }
                }
            }

            # Add sender ID if provided (not supported in all countries)
            if from_phone:
                params['MessageAttributes']['AWS.SNS.SMS.SenderID'] = {
                    'DataType': 'String',
                    'StringValue': from_phone
                }

            # Send SMS using AWS SNS
            response = self.sns_client.publish(**params)

            message_id = response.get('MessageId')
            print(f"[AWS SNS] Message sent successfully")
            print(f"[AWS SNS] MessageId: {message_id}")
            print(f"[AWS SNS] To: {to_phone}")

            return True

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            print(f"[AWS SNS ERROR] Failed to send SMS")
            print(f"[AWS SNS ERROR] Error code: {error_code}")
            print(f"[AWS SNS ERROR] Error message: {error_message}")
            raise Exception(f"AWS SNS SMS failed: {error_message}")

        except Exception as e:
            print(f"[AWS SNS ERROR] Unexpected error: {e}")
            raise Exception(f"SMS sending failed: {str(e)}")

    async def send_verification_code(
        self,
        to_phone: str,
        code: str,
        language: str = "en"
    ) -> bool:
        """
        Send verification code via AWS SNS

        Args:
            to_phone: Recipient phone number in E.164 format
            code: Verification code
            language: Language code for message

        Returns:
            bool: True if sent successfully
        """
        message = self._format_verification_message(code, language)

        print(f"[AWS SNS] Sending verification code")
        print(f"[AWS SNS] To: {to_phone}")
        print(f"[AWS SNS] Language: {language}")

        return await self.send_sms(to_phone, message)
