# 04. Template / Handlers / Tags

## Template (Jinja2)
템플릿 파일(`.j2`)에 변수를 넣어서 서버에 배포합니다.
- `roles/webserver/templates/index.html.j2`

## Handlers
설정 파일이 변경되었을 때만 서비스 재시작 같은 작업을 수행합니다.
- `notify: restart nginx`
- `roles/webserver/handlers/main.yml`

## Tags
일부 작업만 선택 실행 가능합니다.
```bash
ansible-playbook playbooks/03_role_web.yml --tags web
ansible-playbook playbooks/03_role_web.yml --tags config
```
