# 05. Ansible Vault로 시크릿 관리

## 왜 필요한가?
- Access Key, 비밀번호 같은 값은 Git에 올리면 사고가 납니다.
- Vault는 파일을 암호화해 저장하고, 실행 시 복호화해서 사용합니다.

## 1) Vault 파일 생성
```bash
ansible-vault create group_vars/all/vault.yml
```

예시 내용:
```yaml
aws_access_key_id: "..."
aws_secret_access_key: "..."
```

## 2) 실행 시 비밀번호 입력
```bash
ansible-playbook playbooks/20_aws_create_vpc.yml --ask-vault-pass
```

## 3) vault_password_file (주의)
학습 편의를 위해 비밀번호 파일을 쓸 수 있지만, 운영에서는 권장하지 않습니다.
