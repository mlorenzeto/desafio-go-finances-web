import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import swal from 'sweetalert';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (uploadedFiles.length <= 0) {
      swal('', 'Nenhum arquivo foi selecionado para importação!', 'warning');

      return;
    }

    try {
      uploadedFiles.forEach(async uploadedFile => {
        const data = new FormData();

        data.append('file', uploadedFile.file);
        await api.post('/transactions/import', data);
      });

      swal('', 'Arquivo importado com sucesso!', 'success');
    } catch (err) {
      console.log(err.response.error);
      swal('', 'Erro ao importar o arquivo!', 'error');
    }
  }

  function submitFile(files: File[]): void {
    const formatedFiles: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles([...uploadedFiles, ...formatedFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
